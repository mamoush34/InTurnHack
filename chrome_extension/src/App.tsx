import React from 'react';
import './App.css';
import { messageActiveTab } from './messaging';
import { getToken, logout } from './authorization';
import { observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import logo from "./logo.svg";

@observer
export default class App extends React.Component<{}> {
    @observable private token: string | undefined = undefined;

    componentWillMount() {
        this.login();   
    }
    
    private login = async () => {
        const token = await getToken();
        runInAction(() => this.token = token);
    }

    private logout = async () => {
        const token = this.token;
        if (token) {
            await logout(token);
            window.close();
        }
    }

    private searchForEmbeddedBoards = async () => {
        messageActiveTab({
            action: "searchForEmbeddedBoards",
            user: "samuel_wilkins@brown.edu"
        });
    };

    render() {
        const token = this.token;
        if (!token) {
            return (
                <div style={{ background: `url(${logo})`, margin: 50 }} />
            );
        }
        return (
            <div className="App">
                <header className="App-header">
                    <p
                        className={"greenhouse-prompt"}
                        onClick={this.searchForEmbeddedBoards}
                    >
                        Check page for embedded greenhouse.io application boards.
                    </p>
                    <span onClick={this.logout}>Log Out</span>
                </header>
            </div>
        );
    }

}
