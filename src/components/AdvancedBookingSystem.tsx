import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface BookingData {
  service: string;
  date: Date;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface AdvancedBookingSystemProps {
  currentLanguage: any;
  isGringo: boolean;
}

const services = [
  {
    id: 'coworking',
    name: { en: 'Coworking Space', es: 'Espacio de Coworking' },
    price: 25000,
    duration: 'Daily',
    capacity: 20,
    description: {
      en: 'High-speed internet, coffee included, perfect for digital nomads',
      es: 'Internet de alta velocidad, café incluido, perfecto para nómadas digitales'
    }
  },
  {
    id: 'salsa-class',
    name: { en: 'Salsa Dancing Class', es: 'Clase de Salsa' },
    price: 35000,
    duration: '1.5 hours',
    capacity: 20,
    description: {
      en: 'Learn authentic Colombian salsa with professional instructors',
      es: 'Aprende salsa colombiana auténtica con instructores profesionales'
    }
  },
  {
    id: 'medellin-tour',
    name: { en: 'Medellín City Tour', es: 'Tour por Medellín' },
    price: 60000,
    duration: '4 hours',
    capacity: 8,
    description: {
      en: 'Explore the city\'s transformation and hidden gems',
      es: 'Explora la transformación de la ciudad y joyas ocultas'
    }
  },
  {
    id: 'coffee-tasting',
    name: { en: 'Premium Coffee Tasting', es: 'Cata de Café Premium' },
    price: 50000,
    duration: '2 hours',
    capacity: 12,
    description: {
      en: 'Professional tasting of single-origin Colombian coffees',
      es: 'Cata profesional de cafés colombianos de origen único'
    }
  },
  {
    id: 'cooking-class',
    name: { en: 'Colombian Cooking Class', es: 'Clase de Cocina Colombiana' },
    price: 80000,
    duration: '3 hours',
    capacity: 10,
    description: {
      en: 'Learn to cook traditional Colombian dishes',
      es: 'Aprende a cocinar platos tradicionales colombianos'
    }
  }
];

export const AdvancedBookingSystem: React.FC<AdvancedBookingSystemProps> = ({ currentLanguage, isGringo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateBookingData = (field: keyof BookingData, value: any) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSuccess(false);
      setIsOpen(false);
      setStep(1);
      setBookingData({});
    }, 3000);
  };

  const selectedService = services.find(s => s.id === bookingData.service);
  const totalPrice = selectedService ? selectedService.price * (bookingData.guests || 1) : 0;

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                {isGringo ? 'Choose Your Experience' : 'Elige Tu Experiencia'}
              </h3>
              <p className="text-slate-400">
                {isGringo ? 'Select from our premium Gringo Connection services' : 'Selecciona de nuestros servicios premium de Conexión Gringo'}
              </p>
            </div>

            <div className="grid gap-3">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    bookingData.service === service.id
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500'
                      : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
                  }`}
                  onClick={() => updateBookingData('service', service.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">
                          {service.name[currentLanguage?.code === 'es' ? 'es' : 'en']}
                        </h4>
                        <p className="text-sm text-slate-400 mt-1">
                          {service.description[currentLanguage?.code === 'es' ? 'es' : 'en']}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span>⏱️ {service.duration}</span>
                          <span>👥 Max {service.capacity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-400">
                          ${service.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">
                          {isGringo ? 'per person' : 'por persona'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                {isGringo ? 'Select Date & Time' : 'Selecciona Fecha y Hora'}
              </h3>
              <p className="text-slate-400">
                {isGringo ? 'Choose your preferred date and time' : 'Elige tu fecha y hora preferidas'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">
                  {isGringo ? 'Date' : 'Fecha'}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingData.date ? format(bookingData.date, 'PPP') : (isGringo ? 'Pick a date' : 'Elige una fecha')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600">
                    <Calendar
                      mode="single"
                      selected={bookingData.date}
                      onSelect={(date) => updateBookingData('date', date)}
                      disabled={(date) => date < new Date()}
                      className="text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-white">
                  {isGringo ? 'Time' : 'Hora'}
                </Label>
                <Select onValueChange={(value) => updateBookingData('time', value)}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder={isGringo ? 'Select time' : 'Selecciona hora'} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                    <SelectItem value="18:00">6:00 PM</SelectItem>
                    <SelectItem value="19:00">7:00 PM</SelectItem>
                    <SelectItem value="20:00">8:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">
                {isGringo ? 'Number of Guests' : 'Número de Invitados'}
              </Label>
              <Select onValueChange={(value) => updateBookingData('guests', parseInt(value))}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder={isGringo ? 'Select guests' : 'Selecciona invitados'} />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                {isGringo ? 'Contact Information' : 'Información de Contacto'}
              </h3>
              <p className="text-slate-400">
                {isGringo ? 'Please provide your details for confirmation' : 'Por favor proporciona tus datos para confirmación'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">
                    {isGringo ? 'First Name' : 'Nombre'}
                  </Label>
                  <Input
                    value={bookingData.name || ''}
                    onChange={(e) => updateBookingData('name', e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder={isGringo ? 'John' : 'Juan'}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">
                    {isGringo ? 'Last Name' : 'Apellido'}
                  </Label>
                  <Input
                    value={bookingData.lastName || ''}
                    onChange={(e) => updateBookingData('lastName', e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder={isGringo ? 'Smith' : 'Rodríguez'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">
                  <Mail className="inline h-4 w-4 mr-2" />
                  {isGringo ? 'Email' : 'Correo'}
                </Label>
                <Input
                  type="email"
                  value={bookingData.email || ''}
                  onChange={(e) => updateBookingData('email', e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">
                  <Phone className="inline h-4 w-4 mr-2" />
                  {isGringo ? 'Phone' : 'Teléfono'}
                </Label>
                <Input
                  type="tel"
                  value={bookingData.phone || ''}
                  onChange={(e) => updateBookingData('phone', e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white"
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">
                  {isGringo ? 'Special Requests' : 'Solicitudes Especiales'}
                </Label>
                <Textarea
                  value={bookingData.notes || ''}
                  onChange={(e) => updateBookingData('notes', e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white"
                  placeholder={isGringo ? 'Any special requirements...' : 'Cualquier requerimiento especial...'}
                  rows={3}
                />
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                {isGringo ? 'Booking Summary' : 'Resumen de Reservación'}
              </h3>
              <p className="text-slate-400">
                {isGringo ? 'Please review your booking details' : 'Por favor revisa los detalles de tu reservación'}
              </p>
            </div>

            {selectedService && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        {selectedService.name[currentLanguage?.code === 'es' ? 'es' : 'en']}
                      </h4>
                      <p className="text-slate-400 text-sm">
                        {selectedService.description[currentLanguage?.code === 'es' ? 'es' : 'en']}
                      </p>
                    </div>
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                      ${selectedService.price.toLocaleString()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-300">
                        {bookingData.date ? format(bookingData.date, 'PPP') : 'No date selected'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-300">
                        {bookingData.time || 'No time selected'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-300">
                        {bookingData.guests || 0} {isGringo ? 'guests' : 'invitados'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-300">Gato Blanco, Zona Rosa</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-600 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">
                        {isGringo ? 'Total Amount:' : 'Monto Total:'}
                      </span>
                      <span className="text-2xl font-bold text-green-400">
                        ${totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div className="text-sm">
                  <p className="text-yellow-400 font-medium mb-1">
                    {isGringo ? 'Confirmation Required' : 'Confirmación Requerida'}
                  </p>
                  <p className="text-slate-300">
                    {isGringo
                      ? 'You will receive a confirmation email within 24 hours. Payment due upon arrival.'
                      : 'Recibirás un correo de confirmación dentro de 24 horas. Pago al llegar.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
          <CalendarIcon className="h-4 w-4 mr-2" />
          {isGringo ? 'Book Experience' : 'Reservar Experiencia'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {isGringo ? 'Gringo Connection Booking' : 'Reservación Conexión Gringo'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {isGringo ? 'Book your authentic Colombian experience' : 'Reserva tu experiencia colombiana auténtica'}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {isGringo ? 'Booking Confirmed!' : '¡Reservación Confirmada!'}
            </h3>
            <p className="text-slate-400">
              {isGringo
                ? 'Check your email for confirmation details. We can\'t wait to welcome you!'
                : 'Revisa tu correo para detalles de confirmación. ¡No podemos esperar para darte la bienvenida!'
              }
            </p>
          </motion.div>
        ) : (
          <>
            {/* Progress Indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}>
                      {stepNumber}
                    </div>
                    {stepNumber < 4 && (
                      <div className={`w-12 h-0.5 mx-2 ${
                        step > stepNumber ? 'bg-yellow-500' : 'bg-slate-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            {renderStepContent()}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-slate-700">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                {isGringo ? 'Previous' : 'Anterior'}
              </Button>

              {step < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={
                    (step === 1 && !bookingData.service) ||
                    (step === 2 && (!bookingData.date || !bookingData.time || !bookingData.guests)) ||
                    (step === 3 && (!bookingData.name || !bookingData.email || !bookingData.phone))
                  }
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  {isGringo ? 'Next' : 'Siguiente'}
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {isSubmitting ? (
                    <>{isGringo ? 'Confirming...' : 'Confirmando...'}</>
                  ) : (
                    <>{isGringo ? 'Confirm Booking' : 'Confirmar Reservación'}</>
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};