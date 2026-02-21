import { Redirect } from 'expo-router';
import { useState } from 'react';

export default function Index() {
  // For now, we manually set this. 
  // Later, Firebase will tell us if this is true or false.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    // If not logged in, send them straight to the Login screen
    return <Redirect href="/login" />;
  }

  // If logged in, send them to the Home Dashboard
  return <Redirect href="./(tabs)/home" />;
}