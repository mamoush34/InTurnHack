
import * as React from "react";
import "./main_view.scss";
import { observable, action } from "mobx";
import { observer } from "mobx-react";

export interface HomeViewProps {
    background: string;
}

@observer
export default class HomeView extends React.Component<HomeViewProps> {
    @observable private counter = 0;

    render() {
        const { background } = this.props;
        return (
            <div
                className="container"
                style={{ background }}
            >
        
            </div>
        );
    }

}