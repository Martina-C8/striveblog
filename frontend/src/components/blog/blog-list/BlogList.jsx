import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
// import posts from "../../../data/posts.json";
import BlogItem from "../blog-item/BlogItem";


const BlogList = props => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch("http://localhost:5001/blogPosts")
    .then(res => res.json())
    .then(data => setPosts(data.docs))
  }, [])
  return (
    <Row>
      {posts.map((post, i) => (
        <Col
          key={`item-${i}`}
          md={4}
          style={{
            marginBottom: 50,
          }}
        >
          <BlogItem key={post.title} {...post} />
        </Col>
      ))}
    </Row>
  );
};

export default BlogList;
