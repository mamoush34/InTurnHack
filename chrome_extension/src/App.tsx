import React from 'react';
import './App.css';
import { messageActiveTab } from './messaging';
import { logout, getUserInfo, UserInfo } from './authorization';
import { observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import logo from "./logo.svg";

@observer
export default class App extends React.Component<{}> {
    @observable private userInfo?: UserInfo;

    componentWillMount() {
        this.login();
    }

    private login = async () => {
        const userInfo = await getUserInfo();
        runInAction(() => this.userInfo = userInfo);
    }

    private logout = async () => {
        await logout();
        window.close();
    }

    private apply = async () => {
        const { userInfo } = this;
        if (!userInfo) {
            return alert("This session is not associated with a valid user. Please retry authentication.");
        }
        const { email } = userInfo;
        await messageActiveTab({
            action: "__logApplicationEntry",
            user: email
        });
        const response = await messageActiveTab({
            action: "__openEmbeddedBoards",
            user: email
        });
        if (response === false) {
            alert("No embedded greenhouse.io content was found.");
        }
    };

    private get renderUserHeader() {
        if (!this.userInfo) {
            return (null);
        }
        const { email, picture } = this.userInfo;
        return (
            <>
                <img
                    className={"user-icon"}
                    src={picture}
                />
                <span className={"email"}>{email}</span>
            </>
        );
    }

    render() {
        if (!this.userInfo) {
            return (
                <div style={{ background: `url(${logo})`, margin: 50 }} />
            );
        }
        return (
            <div className="App">
                {this.renderUserHeader}
                <header className="App-header">
                    <p
                        className={"greenhouse-prompt"}
                        onClick={this.apply}
                    >
                        Capture and begin application!
                    </p>
                </header>
                <span className={"log-out"} onClick={this.logout}>Log Out</span>
            </div>
        );
    }

}
