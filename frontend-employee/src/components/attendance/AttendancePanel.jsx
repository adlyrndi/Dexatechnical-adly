import { useState, useEffect } from 'react';
import { attendanceService } from '../../services/api';
import AttendanceStats from './AttendanceStats';
import AttendanceActions from './AttendanceActions';
import PolicyBox from './PolicyBox';

export const AttendancePanel = ({ todayStatus, fetchStatus }) => {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePhotoChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'in') {
          setPhoto(file);
          setPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClockIn = async (e) => {
    e.preventDefault();
    setError('');
    if (!photo) return setError('Silakan pilih foto selfie terlebih dahulu.');

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', photo);
      const uploadData = await attendanceService.uploadPhoto(formData);
      
      await attendanceService.clockIn({ clockInPhoto: uploadData.url });
      fetchStatus();
    } catch (err) {
      setError(err.message || 'Gagal absen masuk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClockOut = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await attendanceService.clockOut();
      fetchStatus();
    } catch (err) {
      setError(err.message || 'Gagal absen pulang.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
      <div className="lg:col-span-4 flex flex-col gap-6">
        <AttendanceStats currentTime={currentTime} todayStatus={todayStatus} />
        <PolicyBox />
      </div>
      
      <AttendanceActions 
        todayStatus={todayStatus}
        error={error}
        setError={setError}
        isSubmitting={isSubmitting}
        preview={preview}
        handlePhotoChange={handlePhotoChange}
        handleClockIn={handleClockIn}
        handleClockOut={handleClockOut}
      />
    </div>
  );
};
export default AttendancePanel;
