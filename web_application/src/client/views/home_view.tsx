
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
import { MapUtils } from "../utilities/map_types";
import { Comparators, Ordering, Compare } from "../utilities/comparators";
import DynamicOrderedMap from "../utilities/dynamic_map";

library.add(faIdBadge);

export interface HomeViewProps {
    background: string;
}

@observer
export default class HomeView extends React.Component<HomeViewProps> {
    @observable private filterBox?: HTMLInputElement;
    @observable private openCreation: boolean = false;
    @observable private jobsMap?: DynamicOrderedMap<string, Job>;
    private descending = true;

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
            this.jobsMap = new DynamicOrderedMap(initial, Ordering.STATUS);
        }));
    }

    @action
    addJob = (newJob: Job) => {
        Server.Post("/jobs", newJob).then(_id => {
            newJob.id = _id;
            this.jobsMap?.insert(_id, newJob);
        });
    }

    @action
    close = () => {
        this.openCreation = false;
    }

    @computed
    private get sortingPanel() {
        return <div
            className={"job-rect"}
            style={{ marginBottom: 40 }}
            onClick={() => {
                const { jobsMap } = this;
                if (!jobsMap) {
                    return;
                }
                let ordering = jobsMap.currentOrdering;
                if (this.descending) {
                    this.descending = false;
                } else {
                    this.descending = true;
                    ordering = this.jobsMap?.currentOrdering === Ordering.STATUS ? Ordering.COMPANY : Ordering.STATUS;
                }
                if (ordering !== "unsorted") {
                    jobsMap.invalidateOrdering(ordering);
                }
                let comparator: Compare.Map.ByValue<Job>;
                if (ordering === "unsorted") {
                    comparator = Comparators.unsorted;
                } else {
                    comparator = Comparators.sorted(ordering, this.descending);
                }
                jobsMap.sortBy(comparator, ordering);
            }}
        >
            <div>SORTED BY {this.jobsMap?.currentOrdering}</div>
        </div>
    }

    @computed
    private get renderPage() {
        const { jobsMap } = this;
        let renderedJobs = (null);
        if (jobsMap) {
            renderedJobs = MapUtils.valuesOf(jobsMap.current).map(job => (<ApplicationRec listedJob={job} ></ApplicationRec>))
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