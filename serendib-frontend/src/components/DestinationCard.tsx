import {Heart, MapPin} from "lucide-react";
import type {Destinations} from "../data/destinations";

type Props = {
    destination: Destinations;
};

export default function Destinationcard({destination}: Props) {
    return (
        <article className="destination-card">
            <div className="card-image-wrap">
                <img src = {destination.image} alt ={destination.name}/>
                <button className="save-button" aria-lable={`Save ${destination.name} `}> 
                    <Heart size ={17}/>
                </button>
            </div>
            <div className ="card-content">
            <div className="card-meta">
                <span>{destination.category}</span>
                <span className="dot">·</span>
                <span><MapPin size={13} /> {destination.location}</span>
            </div>
            <h3>{destination.name}</h3>
            <p>{destination.description}</p>
            <a className="text-link" href={`#${destination.name.toLowerCase()}`}>
                Explore place <span>↗</span>
            </a>
            </div>
        </article>
    );
}
