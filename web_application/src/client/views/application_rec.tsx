
import * as React from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { Job } from "../models/Job";
import "./application_rec.scss";
import { Status } from "./add_job_page";
import { Server } from "../utilities/utilities";

interface ApplicationRecProps {
    listedJob: Job
}

@observer
export class ApplicationRec extends React.Component<ApplicationRecProps> {
    @observable private colorOptions: Map<number, string> = new Map();

    renderJobColor = () => {
        switch (this.props.listedJob.status) {
            case "Pending":
                return "#FFFF00CC";
            case "Accepted":
                return "#00FF0033";
            case "Rejected":
                return "#FF0000AA";
            default:
                return "whitesmoke";
        }
    }

    @action
    renderSelectOptions = () => {
        this.colorOptions = new Map();
        switch (this.props.listedJob.status) {
            case "Pending":
                this.colorOptions.set(Status.PENDING, "Pending");
                this.colorOptions.set(Status.ACCEPTED, "Accepted");
                this.colorOptions.set(Status.REJECTED, "Rejected");
            case "Accepted":
                this.colorOptions.set(Status.ACCEPTED, "Accepted");
                this.colorOptions.set(Status.PENDING, "Pending");
                this.colorOptions.set(Status.REJECTED, "Rejected");
            case "Rejected":
                this.colorOptions.set(Status.REJECTED, "Rejected");
                this.colorOptions.set(Status.ACCEPTED, "Accepted");
                this.colorOptions.set(Status.PENDING, "Pending");
            default:
                return;
        }
    }

    @action
    componentDidMount() {
        this.renderSelectOptions();

        document.querySelectorAll(".custom-select-wrapper").forEach(element => {
            element.addEventListener('click', function (this: any) {
                this.querySelector('.custom-select').classList.toggle('open');
            })
        })

        document.querySelectorAll(".custom-option").forEach(element => {
            element.addEventListener('click', function (this: any) {
                if (!this.classList.contains('selected')) {
                    this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
                    this.classList.add('selected');
                    this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent;
                }
            })
        });
    }

    componentDidUpdate() {
        document.querySelectorAll(".custom-option").forEach(element => {
            element.addEventListener('click', function (this: any) {
                if (!this.classList.contains('selected')) {
                    this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
                    this.classList.add('selected');
                    this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent;
                }
            })
        });
    }

    onClickUpdate = (newStatus: string) => {
        this.props.listedJob.status = newStatus;
        const newObject = { job: this.props.listedJob, field: "status" };
        Server.Post("/jobUpdate", newObject);

    }

    render() {
        const { listedJob } = this.props;
        return (
            <div className="job-rect" style={{ background: this.renderJobColor() }}>
                <div className="job-field" id="job-title" style={{ width: "40%" }}>
                    {listedJob.jobTitle}
                </div>
                <div className="job-field" id="company">
                    {listedJob.company}
                </div>
                <div className="job-field" id="app-date">
                    {listedJob.appDate}
                </div>
                <div className="job-field" id="status">
                    <div className="custom-select-wrapper">
                        <div className="custom-select">
                            <div className="custom-select__trigger">
                                <span>{listedJob.status}</span>
                                <div className="arrow"></div>
                            </div>
                            <div className="custom-options">
                                {Array.from(this.colorOptions.values()).map((value, index) => {
                                    if (index == 0) {
                                        return <span className="custom-option selected" data-value={index} onClick={() => this.onClickUpdate(value)}>{value}</span>

                                    } else {
                                        return <span className="custom-option" data-value={index} onClick={() => this.onClickUpdate(value)}>{value}</span>
                                    }

                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}