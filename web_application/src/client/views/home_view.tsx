
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
import DynamicJobMap from "../utilities/dynamic_job_map";

library.add(faIdBadge);


export interface HomeViewProps {
    background: string;
}

@observer
export default class HomeView extends React.Component<HomeViewProps> {
    @observable private filterBox?: HTMLInputElement;
    @observable private openCreation: boolean = false;
    @observable private jobs: Job[] = [];
    @observable private jobsMap?: DynamicJobMap;

    componentDidMount() {
        Server.Post("/jobs").then(action(response => {
            let initial = new Map<string, Job>();
            if (Array.isArray(response) && response.length) {
                response.forEach(job => initial.set(job._id, job));
                this.jobs = response;
            }
            this.jobsMap = new DynamicJobMap(initial);
        }));
    }

    @action
    addJob = (newJob: Job) => {
        this.jobs.push(newJob);
        Server.Post("/jobs", newJob);
    }

    @action
    close = () => {
        this.openCreation = false;
    }

    @computed
    private get renderPage() {
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
                {this.jobs.map(job => (<ApplicationRec listedJob={job} ></ApplicationRec>))}
            </div>
        }

    }

    render() {
        return this.renderPage;
    }

}