import { observable } from "mobx";
import { Matchable } from "dynamicinteractivemap";

interface Contact {
    name: string,
    phoneNum: number,
    email: string
}

export class Job implements Matchable {

    matches = (filter: string, isCaseSensitive: boolean) => {
        let fields = [
            this.jobTitle,
            this.company,
            this.appDate,
            this.status
        ];
        if (!isCaseSensitive) {
            fields = fields.map(field => field.toLowerCase());
        }
        return fields.some(field => field.includes(filter));
    };

    private _id?: string;
    public get id() {
        return this._id || "__pending__";
    }
    public set id(value: string) {
        if (value && value.length) {
            this._id = value;
        }
    }
    @observable public company: string;
    @observable public jobTitle: string;
    @observable public appDate: string;
    @observable public status: string;
    @observable public datePosted: string;
    @observable public recruiterName: string;
    @observable public recruiterEmail: string;
    @observable public applicationWay: string;
    @observable public referralOptions: Contact[];

    constructor(company: string, jobTitle: string, appDate: string, status: string, datePosted: string, recruiterName: string, recruiterEmail: string, applicationWay: string, referralOptions: Contact[]) {
        this.company = company;
        this.jobTitle = jobTitle;
        this.appDate = appDate;
        this.status = status;
        this.datePosted = datePosted;
        this.recruiterName = recruiterName;
        this.recruiterEmail = recruiterEmail;
        this.applicationWay = applicationWay;
        this.referralOptions = referralOptions;
    }

}
