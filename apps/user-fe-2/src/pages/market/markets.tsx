import { Link } from "react-router"

export default function Markets(){
    return(
        <div>
            <h3>Open market</h3>
            <Link to={"/market/5454"}>Market id</Link>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perspiciatis porro enim ullam obcaecati qui. Minima asperiores provident minus placeat esse.</p>
        </div>
    )
}