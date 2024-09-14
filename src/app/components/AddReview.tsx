'use client';
import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, onSnapshot } from "firebase/firestore"; 
import { db } from './firebase';
import { Container, TextField, Button, List, ListItem, ListItemText, Typography, Box } from '@mui/material';

export default function AddReview() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState<{ name: string, specialization: string, review: string }>({ name: '', specialization: '', review: '' });
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Capitalize words
  const capitalizeWords = (str: string): string => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Add review to db
  const addReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.name !== '' && newReview.specialization !== '' && newReview.review !== '') {
      const professorName = capitalizeWords(newReview.name.trim().toLowerCase());

      // Add new review
      await addDoc(collection(db, 'professors'), {
        name: professorName,
        specialization: newReview.specialization,
        review: newReview.review
      });

      setNewReview({ name: '', specialization: '', review: '' });
    }
  };

  // Get data from Firestore
  useEffect(() => {
    const q = query(collection(db, 'professors'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let reviewsArr: any[] = [];
      querySnapshot.forEach((doc) => {
        reviewsArr.push({ ...doc.data(), id: doc.id });
      });
      setReviews(reviewsArr);
    });
    return () => unsubscribe();
  }, []);

  // Filter reviews by search query (name or specialization)
  const filteredReviews = reviews.filter((review) =>
    review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Container sx={{ bgcolor: 'white', color: 'black', minHeight: '100vh', py: 4, height: '100vh', width: '100vw' }}>
        <Typography variant="h3" align="center" gutterBottom>Professor Reviews</Typography>
        
        {/* Form Layout */}
        <Box component="form" onSubmit={addReview} sx={{ mb: 4 }}>
          {/* Row 1: Name and Specialization */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              value={newReview.name}
              onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
              label="Enter Professor Name"
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: 'black' } }}
              InputProps={{ style: { color: 'black', backgroundColor: '#f5f5f5' } }} 
            />
            <TextField
              value={newReview.specialization}
              onChange={(e) => setNewReview({ ...newReview, specialization: e.target.value })}
              label="Enter Specialization"
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: 'black' } }}
              InputProps={{ style: { color: 'black', backgroundColor: '#f5f5f5' } }} 
            />
          </Box>

          {/* Row 2: Review and Submit Button */}
          <Box sx={{ display: 'flex', gap: 2 , mb: 2 }}>
            <TextField
              value={newReview.review}
              onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
              label="Enter Review"
              variant="outlined"
              fullWidth
              multiline
              rows={1}
              InputLabelProps={{ style: { color: 'black' } }}
              InputProps={{ style: { color: 'black', backgroundColor: '#f5f5f5' } }} 
            />
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ bgcolor: 'black', color: 'white', width: '150px', '&:hover': { bgcolor: 'grey' } }}
            >
              Submit
            </Button>
          </Box>
        </Box>

        {/* Search Bar */}
        <TextField
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          label="Search Professors or Specializations"
          variant="outlined"
          fullWidth
          InputLabelProps={{ style: { color: 'black' } }}
          InputProps={{ style: { color: 'black', backgroundColor: '#f5f5f5' } }} 
          sx={{ mb: 4 }}
        />

        {/* Displaying Reviews */}
        <List>
          {filteredReviews.map((review, id) => (
            <ListItem key={id} sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: '#e0e0e0', mb: 2 }}>
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ color: 'black', flex: 1 }}>{review.name} - {review.specialization}</span>
                    <span style={{ color: 'black', flex: 2 }}>{review.review}</span>
                  </Box>
                } 
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
}
