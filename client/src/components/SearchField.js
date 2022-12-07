import { FaSearch } from "react-icons/fa"
import "../assets/css/SearchField.css"


/**
 * Creates a search field component for the user to be able to search through data in the store.
 * 
 * @param props.placeholder The text to display in the placeholder of the input field
 * @param props.onChange The function that defines what to do when a user uses the search field 
 * 
 * @returns The search field component
 */
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