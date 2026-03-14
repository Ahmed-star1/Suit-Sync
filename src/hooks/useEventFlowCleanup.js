import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { clearEventData } from '../Redux/Utils/localStore';

/**
 * Custom hook that clears event data from localStorage when user navigates away from event flow
 * This ensures event data is only kept while user is in event creation/editing process
 */
export const useEventFlowCleanup = () => {
  const location = useLocation();

  useEffect(() => {
    // Event-related routes where data should be preserved
    const eventPaths = [
      '/create-event',
      '/add-event-member',
      '/edit-event',
      '/edit-event-members'
    ];

    // Check if current path is an event route
    const isEventRoute = eventPaths.some(path => 
      location.pathname.startsWith(path)
    );

    // If not in event flow, clear the event data
    if (!isEventRoute) {
      clearEventData();
    }
  }, [location.pathname]);
};
