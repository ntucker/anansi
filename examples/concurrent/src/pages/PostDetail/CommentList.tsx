import { Img } from '@data-client/img';
import { useSuspense } from '@data-client/react';
import { Card, Avatar } from 'antd';

import { CommentResource, Comment } from 'resources/Discuss';
const { Meta } = Card;

type Props = { postId: string };

export default function CommentList({ postId }: Props) {
  const comments = useSuspense(CommentResource.getList, { postId });

  return (
    <>
      {comments.map(comment => (
        <CommentInline key={comment.pk()} comment={comment} />
      ))}
    </>
  );
}

function CommentInline({ comment }: { comment: Comment }) {
  return (
    <Card style={{ marginTop: 16 }}>
      <Meta
        avatar={<Img component={Avatar} src={comment.profileImage} />}
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
