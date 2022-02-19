import { useResource } from 'rest-hooks';
import { Card, Avatar } from 'antd';

import { CommentResource } from 'resources/Discuss';
const { Meta } = Card;

type Props = { postId: string };

export default function CommentList({ postId }: Props) {
  const comments = useResource(CommentResource.list(), { postId });

  return (
    <>
      {comments.map(comment => (
        <CommentInline key={comment.pk()} comment={comment} />
      ))}
    </>
  );
}

function CommentInline({ comment }: { comment: CommentResource }) {
  return (
    <Card style={{ marginTop: 16 }}>
      <Meta
        avatar={<Avatar src={comment.profileImage} />}
        title={
          <>
            <a
              href={`mailto:${comment.email}`}
              target="_blank"
              rel="noreferrer"
            >
              {comment.email}
            </a>{' '}
            commented
          </>
        }
        description={comment.body}
      />
    </Card>
  );
}
