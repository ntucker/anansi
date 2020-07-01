import { useResource } from 'rest-hooks';
import { List, Comment } from 'antd';
import { CommentResource } from 'data/resources';

type Props = { postId: number };

export default function CommentList({ postId }: Props) {
  const comments = useResource(CommentResource.listShape(), { postId });
  return (
    <List
      className="comment-list"
      header={`${comments.length} replies`}
      itemLayout="horizontal"
      dataSource={comments}
      renderItem={comment => (
        <li key={comment.pk()}>
          <Comment author={comment.email} content={comment.body} />
        </li>
      )}
    />
  );
}
