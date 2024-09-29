import { Link } from '@anansi/router';
import { EditOutlined, SaveOutlined, LoadingOutlined } from '@ant-design/icons';
import { useLoading } from '@data-client/hooks';
import { Img } from '@data-client/img';
import { useSuspense, useController, AsyncBoundary } from '@data-client/react';
import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { Button, Input, Breadcrumb, Form } from 'antd';
import { Card, Avatar } from 'antd';
import { lazy, useCallback, useState } from 'react';

import { PostResource, UserResource, Post, User } from '@/resources/Discuss';

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
  const post = useSuspense(PostResource.get, { id });
  const author = useSuspense(UserResource.get, { id: post.userId });

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
      <AsyncBoundary fallback={<CardLoading />}>
        <CommentList postId={id} />
      </AsyncBoundary>
    </>
  );
}
export function CardLoading() {
  return <Card style={{ marginTop: 16 }} loading={true} />;
}

function PostMain({ post, author }: { post: Post; author: User }) {
  const { fetch } = useController();

  const [edit, setEdit] = useState(false);

  const toggleEdit = useCallback(() => {
    if (edit) return;
    setEdit(true);
  }, [edit]);

  const [onFinish, loading] = useLoading(
    async (values: any) => {
      if (edit)
        await fetch(PostResource.partialUpdate, { id: post.id }, values);
      setEdit(edit => !edit);
    },
    [post.id, fetch, edit],
  );
  const content =
    edit ?
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
    : <Meta
        avatar={<Img component={Avatar} src={author?.profileImage} />}
        title={post.title}
        description={post.body}
      />;
  return (
    <Form onFinish={onFinish} initialValues={{ ...post }}>
      <Card
        actions={[
          <Button
            onClick={toggleEdit}
            key={edit ? 'save' : 'edit'}
            shape="circle"
            icon={
              loading ? <LoadingOutlined />
              : edit ?
                <SaveOutlined />
              : <EditOutlined />
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
