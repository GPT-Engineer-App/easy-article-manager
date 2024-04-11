import React, { useState, useEffect } from "react";
import { Box, Button, Container, Flex, FormControl, FormLabel, Heading, Input, List, ListItem, Stack, Textarea, useToast } from "@chakra-ui/react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

// Mocked user session management
const useUserSession = () => {
  const [user, setUser] = useState(() => {
    // Attempt to retrieve user from localStorage
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const saveUser = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, saveUser, logout };
};

// Mocked articles data management
const useArticles = () => {
  const [articles, setArticles] = useState([]);

  // Here you would fetch articles from the API
  // useEffect(() => { fetchArticles(); }, []);

  const createArticle = (article) => {
    // Here you would send a request to the API to create an article
    setArticles([...articles, article]);
  };

  const updateArticle = (id, updatedArticle) => {
    // Here you would send a request to the API to update an article
    setArticles(articles.map((a) => (a.id === id ? updatedArticle : a)));
  };

  const deleteArticle = (id) => {
    // Here you would send a request to the API to delete an article
    setArticles(articles.filter((a) => a.id !== id));
  };

  return { articles, createArticle, updateArticle, deleteArticle };
};

const Index = () => {
  const { user, saveUser, logout } = useUserSession();
  const { articles, createArticle, updateArticle, deleteArticle } = useArticles();
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [newArticle, setNewArticle] = useState({ title: "", description: "" });

  const toast = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    // Here you would validate and make an API call to login
    const mockUser = { email: "user@example.com", username: "user" };
    saveUser(mockUser);
    toast({ title: "Logged in successfully", status: "success" });
  };

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out successfully", status: "info" });
  };

  const handleArticleChange = (e) => {
    const { name, value } = e.target;
    setNewArticle({ ...newArticle, [name]: value });
  };

  const handleArticleSubmit = (e) => {
    e.preventDefault();
    // Here you would validate and make an API call to create/update an article
    if (editingArticleId) {
      updateArticle(editingArticleId, newArticle);
      setEditingArticleId(null);
    } else {
      createArticle({ ...newArticle, id: Date.now() });
    }
    setNewArticle({ title: "", description: "" });
    toast({ title: "Article saved successfully", status: "success" });
  };

  const handleArticleEdit = (article) => {
    setEditingArticleId(article.id);
    setNewArticle({ title: article.title, description: article.description });
  };

  const handleArticleDelete = (id) => {
    deleteArticle(id);
    toast({ title: "Article deleted successfully", status: "error" });
  };

  if (!user) {
    return (
      <Container>
        <Heading>Login</Heading>
        <form onSubmit={handleLogin}>
          <Stack spacing={3}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input type="text" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" />
            </FormControl>
            <Button type="submit" colorScheme="teal">
              Login
            </Button>
          </Stack>
        </form>
      </Container>
    );
  }

  return (
    <Container>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading>Articles Management</Heading>
        <Button onClick={handleLogout} colorScheme="red">
          Logout
        </Button>
      </Flex>
      <form onSubmit={handleArticleSubmit}>
        <Stack spacing={3} mt={4}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input type="text" name="title" value={newArticle.title} onChange={handleArticleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea name="description" value={newArticle.description} onChange={handleArticleChange} />
          </FormControl>
          <Button type="submit" colorScheme="teal" leftIcon={<FaPlus />}>
            {editingArticleId ? "Update Article" : "Create Article"}
          </Button>
        </Stack>
      </form>
      <List spacing={3} mt={4}>
        {articles.map((article) => (
          <ListItem key={article.id} p={3} boxShadow="md">
            <Heading size="md">{article.title}</Heading>
            <Box>{article.description}</Box>
            <Button size="sm" leftIcon={<FaEdit />} colorScheme="yellow" onClick={() => handleArticleEdit(article)} mr={2}>
              Edit
            </Button>
            <Button size="sm" leftIcon={<FaTrash />} colorScheme="red" onClick={() => handleArticleDelete(article.id)}>
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Index;
