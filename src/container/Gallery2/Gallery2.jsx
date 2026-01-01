import React from 'react';
import SubHeading from '../../components/SubHeading/SubHeading';
import { images } from "../../constants";
import EventCard from '../../components/EventCard';
import FullGallery from '../FullGallery/FullGallery';
import './Gallery2.css';

const Gallery2 = () => {
  const [selectedEvent, setSelectedEvent] = React.useState(null);

  // If an event is selected, show full gallery
  if (selectedEvent) {
    return (
      <FullGallery
        event={selectedEvent}
        onBack={() => setSelectedEvent(null)}
      />
    );
  }

  // Main gallery / events overview
  return (
    <div className='app__gallery2' >
      <SubHeading title="Instagram" />
      <h1 className='headtext__cormorant'>Photo Gallery</h1>
      <p className='p__opensans' style={{ color: "#AAA", marginTop: "2rem" }}>
        Check out our recent club nights!
      </p>

      <div className='app__gallery-events'>
          <EventCard
          title="Voya Laf Bratov"
          cover={images.voyageCover}
          onViewAll={() => setSelectedEvent('voyage')}
        />
        

        <EventCard
          title="Crni Cerak Darkside"
          cover={images.crniCerakCover}
          onViewAll={() => setSelectedEvent('crniCerak')}
        />
        <EventCard
          title="Sajfer"
          cover={images.sajferCover}
          onViewAll={() => setSelectedEvent('sajfer')}
        />
        
      </div>
    </div>
  );
};

export default Gallery2;
