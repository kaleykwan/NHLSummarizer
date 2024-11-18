import React from "react";
import "../styles/TeamCard.css";

const TeamCard = ({ team }) => {
  return (
      <div className="team-card">
        <img className="team-card-logo" src={team.logo} width={100} />
        <p className="team-card-name">
          {team.placeName} {team.commonName}
        </p>
      </div>
  );
};
export default TeamCard;
