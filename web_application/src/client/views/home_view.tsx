
import * as React from "react";
import "./home_view.scss";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { Job } from "../models/Job";
import { ApplicationRec } from "./application_rec";
import AddJobPage from "./add_job_page";

export interface HomeViewProps {
    background: string;
    jobs : Job[];
}

@observer
export default class HomeView extends React.Component<HomeViewProps> {
    @observable private counter = 0;
    @observable private filterBox?: HTMLInputElement;
    @observable private openCreation : boolean = false;


    close = () => {
        this.openCreation = false;
    }

    renderAddition = () => {
        if(this.openCreation){
            return <AddJobPage close={this.close}/>
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
                <input 
                        type="text"
                        id="search_bar"
                        placeholder="Search here!"
                        ref={(el) => { if (el) {
                            this.filterBox = el;
                            this.filterBox.focus();
                        }}}
                />
                 <a className="registration" id="register" onClick={() => {
                        this.openCreation = true;
                    }}>
                        Add Job
                </a>
                {this.renderAddition()}

                {this.props.jobs.map(job => (<ApplicationRec listedJob={job}></ApplicationRec>))}
        
            </div>
        );
    }

}