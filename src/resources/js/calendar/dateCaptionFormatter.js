import {jsx} from 'dom-helpers';
import formatDate from "./formatDate";

function dateCaptionFormatter(date) {
    return (
        <div>
            <span class="month">{formatDate.F(date)}</span>
            <span class="year">{formatDate.y(date)}</span>
        </div>
    );
}

export default dateCaptionFormatter;