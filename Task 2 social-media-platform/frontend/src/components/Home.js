import React, { useState, useEffect } from 'react';
import { Container, Paper, TextField, Button, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton } from '@mui/material';
import { ThumbUp, Comment } from '@mui/icons-material';
import axios from 'axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/posts/');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (file) {
        formData.append('image', file);
      }
      
      await axios.post('http://127.0.0.1:8000/api/posts/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setContent('');
      setFile(null);
      fetchPosts();
    } catch (error) {
      console.error('Error posting:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/posts/${postId}/like/`);
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handlePostSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            sx={{ mb: 2 }}
          />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label htmlFor="raised-button-file">
            <Button
              variant="contained"
              component="span"
              startIcon={<Avatar />}
              sx={{ mr: 2 }}
            >
              Add Photo
            </Button>
          </label>
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            Post
          </Button>
        </form>
      </Paper>

      <List>
        {posts.map((post) => (
          <Paper key={post.id} sx={{ p: 2, mb: 2 }}>
            <ListItem>
              <ListItemAvatar>
                <Avatar src={post.user.profile_picture} />
              </ListItemAvatar>
              <ListItemText
                primary={post.user.username}
                secondary={post.content}
              />
            </ListItem>
            {post.image && (
              <img
                src={`http://127.0.0.1:8000${post.image}`}
                alt="Post"
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
              />
            )}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                startIcon={<ThumbUp />}
                onClick={() => handleLike(post.id)}
              >
                Like ({post.total_likes})
              </Button>
              <Button startIcon={<Comment />}>
                Comment
              </Button>
            </Box>
          </Paper>
        ))}
      </List>
    </Container>
  );
};

export default Home;
