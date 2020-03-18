
import * as React from "react";
import "./home_view.scss";
import { observable, action, computed } from "mobx";
import { observer } from "mobx-react";
import { Job } from "../models/Job";
import { ApplicationRec } from "./application_rec";
import AddJobPage from "./add_job_page";
import { Server } from "../utilities/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdBadge } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { DynamicInteractiveMap, Comparators, Compare } from "dynamicinteractivemap";

library.add(faIdBadge);

export interface HomeViewProps {
    background: string;
}

@observer
export default class HomeView extends React.Component<HomeViewProps> {
    @observable private filterBox?: HTMLInputElement;
    @observable private openCreation: boolean = false;
    @observable private jobsMap?: DynamicInteractiveMap<string, Job>;
    @observable private descending = true;

    componentDidMount() {
        Server.Post("/jobs").then(action(response => {
            let initial = new Map<string, Job>();
            if (Array.isArray(response) && response.length) {
                response.forEach(({
                    _id,
                    company,
                    jobTitle,
                    appDate,
                    status,
                    datePosted,
                    recruiterName,
                    recruiterEmail,
                    applicationWay,
                    referralOptions
                }) => {
                    const job = new Job(company, jobTitle, appDate, status, datePosted, recruiterName, recruiterEmail, applicationWay, referralOptions);
                    job.id = _id;
                    initial.set(_id, job);
                });
            }
            this.jobsMap = new DynamicInteractiveMap(initial, "unordered");
        }));
    }

    @action
    addJob = async (newJob: Job) => this.jobsMap?.insert(newJob.id = await Server.Post("/jobs", newJob), newJob);

    @action
    close = () => {
        this.openCreation = false;
    }

    @computed
    private get sortingPanel() {
        return <>
            <div
                className={"job-rect"}
                style={{ marginBottom: 40 }}
                onClick={action(() => {
                    const { jobsMap } = this;
                    if (!jobsMap) {
                        return;
                    }
                    let ordering = jobsMap.currentOrdering;
                    if (this.descending) {
                        this.descending = false;
                    } else {
                        this.descending = true;
                        ordering = this.jobsMap?.currentOrdering === "status" ? "company" : "status";
                    }
                    if (ordering !== "unordered") {
                        jobsMap.invalidateOrderingFor(ordering);
                    }
                    let comparator: Compare.Map.ByValue<Job>;
                    if (ordering === "unordered") {
                        comparator = Comparators.unsorted;
                    } else {
                        comparator = Comparators.sorted(ordering, this.descending);
                    }
                    jobsMap.sortBy(comparator, ordering);
                })}
            >
                <div>SORTED BY {this.jobsMap?.currentOrdering} ({this.descending ? "DESCENDING" : "ASCENDING"})</div>
            </div>
            <div>{this.jobsMap?.render.length} total applications</div>
        </>
    }

    @computed
    private get renderPage() {
        const { jobsMap } = this;
        let renderedJobs = (null);
        if (jobsMap) {
            renderedJobs = <div className={"jobs-container"}>{jobsMap.render.map(job => (<ApplicationRec listedJob={job} ></ApplicationRec>))}</div>
        }
        if (this.openCreation) {
            return <AddJobPage close={this.close} addJob={this.addJob} />
        } else {
            const { background } = this.props;
            return <div
                className="container"
                style={{ background }}
            >
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <input
                        type="text"
                        id="search_bar"
                        placeholder="Search here!"
                        onChange={e => this.jobsMap?.filterBy(e.target.value)}
                        ref={(el) => {
                            if (el) {
                                this.filterBox = el;
                                this.filterBox.focus();
                            }
                        }}
                    />
                    <a className="registration" id="register" title="Add Job!" onClick={() => {
                        this.openCreation = true;
                    }}>
                        <FontAwesomeIcon icon={faIdBadge} size={"3x"} ></FontAwesomeIcon>
                    </a>
                </div>
                {this.sortingPanel}
                {renderedJobs}
            </div>
        }

    }

    render() {
        return this.renderPage;
    }

}