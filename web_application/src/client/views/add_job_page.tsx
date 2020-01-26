import * as React from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { Job } from "../models/Job";
import "./add_job_page.scss"

interface AddJobPageProps {
    close: () => void;
    addJob: (newJob: Job) => void;
}

export const Status = {
    PENDING: 0,
    ACCEPTED: 1,
    REJECTED: 2
};

@observer
export default class AddJobPage extends React.Component<AddJobPageProps> {
    @observable public companyInput?: HTMLInputElement;
    @observable public jobTitleInput?: HTMLInputElement;
    @observable public appDateInput?: HTMLInputElement;
    @observable public statusInput?: HTMLSelectElement;
    @observable public datePostedInput?: HTMLInputElement;
    @observable public recruiterNameInput?: HTMLInputElement;
    @observable public recruiterEmailInput?: HTMLInputElement;
    @observable public applicationWayInput?: HTMLInputElement;
    // @observable public referralOptionsInput?: Contact[];

    @action
    createAndAddJob = () => {
        let newJob = new Job(this.companyInput?.value!, this.jobTitleInput?.value!, this.appDateInput?.value!, this.decipherStatus(this.statusInput?.value!), this.datePostedInput?.value!, this.recruiterNameInput?.value!, this.recruiterEmailInput?.value!, this.applicationWayInput?.value!, []);
        this.props.addJob(newJob);
    }

    decipherStatus = (statusVal: string) => {
        switch (Number(statusVal)) {
            case Status.PENDING:
                return "Pending";
            case Status.ACCEPTED:
                return "Accepted";
            case Status.REJECTED:
                return "Rejected";
            default:
                return "";
        }
    }

    render() {
        return (
            <div style={{ height: "100%", width: "100%" }}>
                <div
                    className="create_background"
                >
                    <div
                        className="create_background"
                        style={{
                            display: "flex",
                            marginTop: "auto",
                            marginBottom: "auto",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <div className="exit" onClick={() => this.props.close()}>X</div>
                        <div className="element_container">
                            <input
                                className="text_input"
                                type="text"
                                placeholder="Enter company name!"
                                ref={(e) => this.companyInput = e!}
                            />
                            <input
                                className="text_input"
                                type="text"
                                placeholder="Enter job title!"
                                ref={(e) => this.jobTitleInput = e!}
                            />
                            <br />
                            <input
                                className="picker"
                                type="date"
                                placeholder="Pick Application date!"
                                ref={(e) => this.appDateInput = e!}
                            />
                            <input
                                className="picker"
                                type="date"
                                placeholder="Pick Job Posting date!"
                                ref={(e) => this.datePostedInput = e!}
                            />
                            <select className="picker" name="status" placeholder="Status" ref={(e) => this.statusInput = e!}>
                                <option value={-1}>Choose Status</option>
                                <option value={Status.PENDING}>Pending</option>
                                <option value={Status.ACCEPTED}>Accepted</option>
                                <option value={Status.REJECTED}>Rejected</option>
                            </select>
                            <input
                                className="text_input"
                                type="text"
                                placeholder="Enter recruiter name!"
                                ref={(e) => this.recruiterNameInput = e!}
                            />
                            <input
                                className="text_input"
                                type="text"
                                placeholder="Enter recruiter email!"
                                ref={(e) => this.recruiterEmailInput = e!}
                            />
                            <input
                                className="text_input"
                                type="text"
                                placeholder="Enter application way!"
                                ref={(e) => this.applicationWayInput = e!}
                            />
                            <br />
                            <button className="buttons" onClick={() => {
                                this.createAndAddJob();
                                this.props.close();
                            }}>
                                Register
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}