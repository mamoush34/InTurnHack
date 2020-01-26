
import * as React from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { Job } from "../models/Job";
import "./application_rec.scss";
import { Status } from "./add_job_page";


interface ApplicationRecProps {
    listedJob : Job
}

@observer
export class ApplicationRec extends React.Component<ApplicationRecProps> {

    
    renderJobColor = () => {
        switch(this.props.listedJob.status) {
            case "Pending" :
                return "#FFFF00CC";
            case "Accepted" :
                return "#00FF0033";
            case "Rejected" :
                return "#FF0000AA";
            default:
                return "whitesmoke";

        }
    }

    componentDidMount() {
        // document.querySelector('.custom-select-wrapper')?.addEventListener('click', function() {
        //     document.querySelector('.custom-select')?.classList.toggle('open');
        // })
        document.querySelectorAll(".custom-select-wrapper").forEach(element => {
            element.addEventListener('click', function(this: any) {
                this.querySelector('.custom-select').classList.toggle('open');
            })
        })
            
    

        document.querySelectorAll(".custom-option").forEach(element => {
            element.addEventListener('click', function(this: any) {
                if (!this.classList.contains('selected')) {
                    this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
                    this.classList.add('selected');
                    this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent;
                }
            })
        });

    }


    render() {
        return(
            <div className="job-rect" style={{background: this.renderJobColor()}}>
                <div className="job-field" id="job-title" style={{width: "40%"}}>
                    {this.props.listedJob.jobTitle}
                </div>
                <div className="job-field" id="company">
                    {this.props.listedJob.company}
                </div>
                <div className="job-field" id="app-date">
                    {this.props.listedJob.appDate}
                </div>
                {/* <div className="job-field" id="status">
                    {this.props.listedJob.status}
                </div> */}
                <div className="job-field" id="status">
                    <div className="custom-select-wrapper">
                        <div className="custom-select">
                            <div className="custom-select__trigger"><span>Tesla</span>
                                <div className="arrow"></div>
                            </div>
                            <div className="custom-options">
                                <span className="custom-option selected" data-value={Status.PENDING}>this.props.listedJob.status</span>
                                <span className="custom-option" data-value={Status.ACCEPTED}>Accepted</span>
                                <span className="custom-option" data-value={Status.REJECTED}>Rejected</span>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>


        );

    }
}