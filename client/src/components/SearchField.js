import { FaSearch } from "react-icons/fa";
import "../assets/css/SearchField.css"

export default function SearchField(props){

    return (
        <div className="search">
            <div className="search-border">
                <FaSearch className="search-icon"/>
                <input 
                    className="search-field"
                    type="text"
                    placeholder={props.placeholder}
                    onChange={props.onChange}
                /> 
            </div>
        </div>
    )
}