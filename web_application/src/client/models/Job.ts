import { observable, action } from "mobx";

interface Contact {
    name: string,
    phoneNum: number,
    email: string
}

export class Job {
    @observable public company: string;
    @observable public jobTitle: string;
    @observable public appDate : Date;
    @observable public status : string;
    @observable public datePosted : Date;
    @observable public recruiterName : string;
    @observable public recruiterEmail: string;
    @observable public applicationWay: string;
    @observable public referralOptions: Contact[];

    constructor(company: string, jobTitle: string, appDate : Date, status : string, datePosted : Date, recruiterName: string, recruiterEmail: string, applicationWay: string, referralOptions : Contact[]) {
        this.company = company;
        this.jobTitle = jobTitle;
        this. appDate = appDate;
        this. status = status;
        this.datePosted = datePosted;
        this.recruiterName = recruiterName;
        this.recruiterEmail = recruiterEmail;
        this.applicationWay = applicationWay;
        this.referralOptions = referralOptions;

    }


}
