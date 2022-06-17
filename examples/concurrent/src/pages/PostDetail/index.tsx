import { useSuspense, useController } from 'rest-hooks';
import { EditOutlined, SaveOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Input, Breadcrumb, Form } from 'antd';
import { Img } from '@rest-hooks/img';
import { useLoading } from '@rest-hooks/hooks';
import { Card, Avatar } from 'antd';
import { Link } from '@anansi/router';
import { styled } from '@linaria/react';
import { lazy, useCallback, useState } from 'react';
import { css } from '@linaria/core';

import { PostResource, UserResource } from 'resources/Discuss';
import Boundary from 'components/Boundary';

export type Props = { id: string };
const { Meta } = Card;
const { TextArea } = Input;
const Breading = styled(Breadcrumb)`
  margin: 16px 0;
`;
const editMeta = css`
  > .ant-card-meta-detail {
    width: 100%;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
`;

const CommentList = lazy(
  () => import(/* webpackPreload: true */ './CommentList'),
);

export default function PostDetail({ id }: Props) {
  const post = useSuspense(PostResource.detail(), { id });
  const author = useSuspense(
    UserResource.detail(),
    post.userId ? { id: post.userId } : null,
  );

  return (
    <>
      <Breading>
        <Breadcrumb.Item>
          <Link name="UserDetail" props={{ id: post.userId }}>
            {author?.name}
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{post.title}</Breadcrumb.Item>
      </Breading>
      <PostMain post={post} author={author} />
      <Boundary fallback={<CardLoading />}>
        <CommentList postId={id} />
      </Boundary>
    </>
  );
}
export function CardLoading() {
  return <Card style={{ marginTop: 16 }} loading={true} />;
}

function PostMain({
  post,
  author,
}: {
  post: PostResource;
  author: UserResource;
}) {
  const { fetch } = useController();

  const [edit, setEdit] = useState(false);

  const toggleEdit = useCallback(() => {
    if (edit) return;
    setEdit(true);
  }, [edit]);

  const [onFinish, loading] = useLoading(
    async (values: any) => {
      if (edit)
        await fetch(PostResource.partialUpdate(), { id: post.id }, values);
      setEdit(edit => !edit);
    },
    [post.id, fetch, edit],
  );
  const content = edit ? (
    <Meta
      className={editMeta}
      avatar={<Img component={Avatar} src={author?.profileImage} />}
      title={
        <Form.Item name="title">
          <Input style={{ width: '100%' }} />
        </Form.Item>
      }
      description={
        <Form.Item name="body">
          <TextArea rows={6} style={{ width: '100%' }} />
        </Form.Item>
      }
    />
  ) : (
    <Meta
      avatar={<Img component={Avatar} src={author?.profileImage} />}
      title={post.title}
      description={post.body}
    />
  );
  return (
    <Form onFinish={onFinish} initialValues={{ ...post }}>
      <Card
        actions={[
          <Button
            onClick={toggleEdit}
            key={edit ? 'save' : 'edit'}
            shape="circle"
            icon={
              loading ? (
                <LoadingOutlined />
              ) : edit ? (
                <SaveOutlined />
              ) : (
                <EditOutlined />
              )
            }
            size="small"
            htmlType={edit ? 'submit' : 'button'}
          />,
        ]}
      >
        {content}
      </Card>
    </Form>
  );
}
