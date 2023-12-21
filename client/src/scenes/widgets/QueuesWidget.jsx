import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQueues } from "state";
import QueueWidget from "./QueueWidget";

const QueuesWidget = ({ businessId }) => {
  const dispatch = useDispatch();
  const queues = useSelector((state) => state.queues);
  const token = useSelector((state) => state.token);

  const getBusinessQueues = async () => {
    const response = await fetch(`http://localhost:3001/queues/business/${businessId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setQueues({ queues: data }));
  }

  useEffect(() => {
    getBusinessQueues();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {queues.slice(1).map(
        ({
          _id,
          userId: { _id: userId, firstName, lastName, picturePath: userPicturePath },
          queueNumber,
          createdAt,
          updatedAt,
        }) => (
          <QueueWidget
            key={_id}
            queueId={_id}
            queueUserId={userId}
            name={`${firstName} ${lastName}`}
            subtitle={createdAt}  // or updatedAt, depending on your requirements
            userPicturePath={userPicturePath}
            queueNum={queueNumber}
          // Add other properties as needed
          />
        )
      )}
    </>
  );
};

export default QueuesWidget;
