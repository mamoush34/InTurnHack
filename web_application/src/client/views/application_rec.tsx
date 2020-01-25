
import * as React from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { Job } from "../models/Job";
import "./application_rec.scss";


interface ApplicationRecProps {
    listedJob : Job
}


export class ApplicationRec extends React.Component<ApplicationRecProps> {


    render() {
        return(
            <div className="job-rect">
                <div className="job-field" id="job-title" style={{width: "40%"}}>
                    {this.props.listedJob.jobTitle}
                </div>
                <div className="job-field" id="company">
                    {this.props.listedJob.company}
                </div>
                <div className="job-field" id="app-date">
                    {this.props.listedJob.appDate}
                </div>
                <div className="job-field" id="status">
                    {this.props.listedJob.status}
                </div>
            </div>


        );

    }
}