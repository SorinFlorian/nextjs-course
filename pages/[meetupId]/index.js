import { MongoClient, ObjectId } from 'mongodb';
import HEAD from 'next/head';
import MeetupDetail from '../../components/meetups/MeetupDetail';

function MeetupDetails(props) {
  return (
    <>
      <HEAD>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </HEAD>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    'mongodb+srv://sorin:LJ3LeFr0kO7aj6E5@cluster0.8vd9nwv.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find({}, { _1d: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map(meetup => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  // fetch data for a single meetup
  const { meetupId } = context.params;

  const client = await MongoClient.connect(
    'mongodb+srv://sorin:LJ3LeFr0kO7aj6E5@cluster0.8vd9nwv.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const selectedMmeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMmeetup._id.toString(),
        title: selectedMmeetup.title,
        address: selectedMmeetup.address,
        image: selectedMmeetup.image,
        description: selectedMmeetup.description,
      },
    },
  };
}

export default MeetupDetails;
