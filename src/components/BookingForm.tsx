import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { User, Mail, Phone, Scissors } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

type BookingFormData = {
  name: string;
  email: string;
  phone: string;
  service: string;
};

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

const services = [
  { id: 'haircut', name: 'Haircut', icon: '✂️' },
  { id: 'coloring', name: 'Coloring', icon: '🎨' },
  { id: 'styling', name: 'Styling', icon: '💇' },
  { id: 'treatment', name: 'Treatment', icon: '💆' },
];

const BookingForm: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<BookingFormData>();
  const selectedService = watch('service');

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }

    const bookingToast = toast.loading('Booking your appointment...');

    try {
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

      await addDoc(collection(db, 'appointments'), {
        ...data,
        date: appointmentDateTime,
        createdAt: new Date()
      });
      
      toast.success('Appointment booked successfully! You will receive a confirmation email and SMS shortly.', {
        id: bookingToast,
      });
      reset();
      setSelectedDate(null);
      setSelectedTime('');
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.', {
        id: bookingToast,
      });
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="space-y-8">
          {/* Service Selection */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Select a Service</h3>
            <div className="grid grid-cols-2 gap-6">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setValue('service', service.id)}
                  className={`p-6 border-2 rounded-lg text-center transition-colors ${
                    selectedService === service.id
                      ? 'bg-indigo-100 border-indigo-500'
                      : 'bg-white hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <span className="text-4xl mb-2 block" role="img" aria-label={service.name}>
                    {service.icon}
                  </span>
                  <span className="font-medium text-lg">{service.name}</span>
                </button>
              ))}
            </div>
            <input type="hidden" {...register("service", { required: "Service is required" })} />
          </div>

          {/* Calendar */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Select Date</h3>
            <div className="flex justify-center">
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date) => setSelectedDate(date)}
                inline
                minDate={new Date()}
                calendarClassName="!w-full max-w-sm mx-auto"
                wrapperClassName="w-full"
              />
            </div>
          </div>
          
          {/* Time Slots */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Select Time</h3>
            <div className="grid grid-cols-3 gap-4">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={`py-3 px-4 border-2 rounded-lg text-lg font-medium ${
                    selectedTime === slot
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Personal Information Form */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Personal Information</h3>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <div className="relative rounded-md shadow-sm">
                  <User className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
                  <input
                    id="name"
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                    placeholder="Your name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative rounded-md shadow-sm">
                  <Mail className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
                  <input
                    id="email"
                    type="email"
                    {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                <div className="relative rounded-md shadow-sm">
                  <Phone className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
                  <input
                    id="phone"
                    type="tel"
                    {...register("phone", { required: "Phone number is required" })}
                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                    placeholder="Your phone number"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="text-red-500 text-sm mt-4">
            {Object.values(errors).map((error, index) => (
              <p key={index}>{error.message}</p>
            ))}
          </div>
        )}

        <div className="mt-8">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Book Appointment
          </button>
        </div>
      </form>
    </>
  );
};

export default BookingForm;