import React from 'react';

export default ({ comments }) => {
  const renderedComments = Object.values(comments).map((comment) => {
    return (
      <li key={comment.id}>
        {comment.status === 'pending' && (
          <i>This comment is pending approval</i>
        )}
        {comment.status === 'rejected' && <i>This comment was rejected</i>}
        {comment.status === 'approved' && <span>{comment.content}</span>}
      </li>
    );
  });

  return <ul>{renderedComments}</ul>;
};
