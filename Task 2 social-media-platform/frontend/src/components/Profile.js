import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Button, Avatar, Box, TextField, List, ListItem, ListItemText, ListItemAvatar, IconButton } from '@mui/material';
import { PersonAdd, PersonRemove, PhotoCamera } from '@mui/icons-material';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/profiles/1/');
      setProfile(response.data);
      setBio(response.data.bio);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleBioUpdate = async () => {
    try {
      await axios.patch('http://127.0.0.1:8000/api/profiles/1/', { bio });
      fetchProfile();
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  const handleProfilePicture = async () => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      
      await axios.patch('http://127.0.0.1:8000/api/profiles/1/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/profiles/${userId}/follow/`);
      fetchProfile();
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src={profile.profile_picture} 
            sx={{ width: 100, height: 100 }}
          />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="profile-picture-upload"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label htmlFor="profile-picture-upload">
            <IconButton color="primary" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>
        <Typography variant="h5" sx={{ mt: 2 }}>
          {profile.user.username}
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          onBlur={handleBioUpdate}
          placeholder="Add a bio"
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="h6">
            Followers: {profile.total_followers}
          </Typography>
          <Typography variant="h6">
            Following: {profile.total_following}
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Suggested Users
        </Typography>
        <List>
          {/* Add suggested users list here */}
          <ListItem>
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <ListItemText primary="User1" />
            <IconButton onClick={() => handleFollow(1)}>
              <PersonAdd />
            </IconButton>
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default Profile;
