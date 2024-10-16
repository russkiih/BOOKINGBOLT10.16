import React from 'react';
import BookingForm from './components/BookingForm';
import { Scissors } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-md">
        <div className="text-center">
          <Scissors className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Book Your Appointment</h2>
          <p className="mt-2 text-sm text-gray-600">
            Fill out the form below to schedule your hair salon appointment
          </p>
        </div>
        <BookingForm />
      </div>
    </div>
  );
}

export default App;