import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQueues } from "state";
import QueueWidget from "./QueueWidget";

const PostsWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const queues = useSelector((state) => state.queues);
  const token = useSelector((state) => state.token);

  const getQueues = async () => {
    const response = await fetch("http://localhost:3001/queues", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setQueues({ queues: data }));
  };

  useEffect(() => {
      getQueues();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {queues.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <QueueWidget
            key={_id}
            queueId={_id}
            queueUserId={userId}
            name={`${firstName} ${lastName}`}
            time={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
