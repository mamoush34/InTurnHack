
import * as React from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { Job } from "../models/Job";


interface ApplicationRecProps {
    listedJob : Job
}


export class ApplicationRec extends React.Component<ApplicationRecProps> {


    render() {
        return(
            <div>
                
            </div>


        );

    }
}