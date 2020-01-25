
import * as React from "react";
import "./home_view.scss";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { Job } from "../models/Job";
import { ApplicationRec } from "./application_rec";
import AddJobPage from "./add_job_page";

export interface HomeViewProps {
    background: string;
}

@observer
export default class HomeView extends React.Component<HomeViewProps> {
    @observable private counter = 0;
    @observable private filterBox?: HTMLInputElement;
    @observable private openCreation : boolean = false;
    @observable private jobs: Job[] = [];

    @action
    addJob = (newJob: Job) => {
        this.jobs.push(newJob);
        console.log("Added: " + newJob);
        console.log("Title" + newJob.jobTitle);
    }

    @action
    close = () => {
        this.openCreation = false;
    }

    renderAddition = () => {
        if(this.openCreation){
            return <AddJobPage close={this.close} addJob= {this.addJob}/>
        } 
        return (null)
    }

    render() {
        const { background } = this.props;
        return (
            <div
                className="container"
                style={{ background }}
            >
                <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                <input 
                        type="text"
                        id="search_bar"
                        placeholder="Search here!"
                        ref={(el) => { if (el) {
                            this.filterBox = el;
                            this.filterBox.focus();
                        }}}
                />
                </div>
                 <a className="registration" id="register" onClick={() => {
                        this.openCreation = true;
                    }}>
                        Add Job
                </a>
                {this.renderAddition()}

                {this.jobs.map(job => (<ApplicationRec listedJob={job} ></ApplicationRec>))}
        
            </div>
        );
    }

}