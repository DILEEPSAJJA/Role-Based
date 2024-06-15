import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = ({ updateProfilePic }) => {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState({
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    phoneNumber: '',
    profilePic: '',
    socialMedia: { twitter: '', facebook: '', linkedin: '' }
  });
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const profileData = docSnap.data();
          setProfile({
            email: profileData.email || '',
            firstName: profileData.firstName || '',
            lastName: profileData.lastName || '',
            gender: profileData.gender || '',
            phoneNumber: profileData.phoneNumber || '',
            profilePic: profileData.profilePic || '',
            socialMedia: {
              twitter: profileData.socialMedia?.twitter || '',
              facebook: profileData.socialMedia?.facebook || '',
              linkedin: profileData.socialMedia?.linkedin || ''
            }
          });
          calculateProgress(profileData);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevState) => ({
      ...prevState,
      socialMedia: {
        ...prevState.socialMedia,
        [name]: value
      }
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (user && newPassword && currentPassword) {
      try {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        toast.success('Password updated successfully');
        setNewPassword('');
        setCurrentPassword('');
      } catch (error) {
        console.error('Error updating password', error);
        toast.error('Error updating password: ' + error.message);
      }
    } else {
      toast.warn('Please fill in all the fields.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // Check if the file size is less than or equal to 5MB
      setFile(file);
    } else {
      toast.warn('File size should be less than or equal to 5MB');
      setFile(null);
    }
  };

  const handleFileUpload = async () => {
    if (file && user) {
      const fileRef = ref(storage, `profilePictures/${user.uid}`);
      try {
        await uploadBytes(fileRef, file);
        const fileURL = await getDownloadURL(fileRef);
        return fileURL;
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Error uploading file');
        return null;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const fileURL = await handleFileUpload();
      const updatedProfile = { ...profile };
      if (fileURL) {
        updatedProfile.profilePic = fileURL;
      }
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, updatedProfile);
      calculateProgress(updatedProfile);
      if (fileURL) {
        updateProfilePic(fileURL);
      }
      toast.success('Profile updated successfully');
    }
  };

  const calculateProgress = (profile) => {
    let completedFields = 0;
    const totalFields = 9; // email, firstName, lastName, gender, phoneNumber, profilePic, twitter, facebook, linkedin

    if (profile.email) completedFields++;
    if (profile.firstName) completedFields++;
    if (profile.lastName) completedFields++;
    if (profile.gender) completedFields++;
    if (profile.phoneNumber) completedFields++;
    if (profile.profilePic) completedFields++;
    if (profile.socialMedia?.twitter) completedFields++;
    if (profile.socialMedia?.facebook) completedFields++;
    if (profile.socialMedia?.linkedin) completedFields++;

    setProgress((completedFields / totalFields) * 100);
  };

  return (
    <div className="container">
      <ToastContainer />
      <h2>Edit Profile</h2>
      <div className="progress mb-3">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {progress}%
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" value={profile.email} disabled />
        </div>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">First Name</label>
          <input type="text" className="form-control" id="firstName" name="firstName" value={profile.firstName} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">Last Name</label>
          <input type="text" className="form-control" id="lastName" name="lastName" value={profile.lastName} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="gender" className="form-label">Gender</label>
          <select className="form-control" id="gender" name="gender" value={profile.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
          <input type="text" className="form-control" id="phoneNumber" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="profilePic" className="form-label">Profile Picture</label>
          <input type="file" className="form-control" id="profilePic" onChange={handleFileChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="twitter" className="form-label">Twitter</label>
          <input type="text" className="form-control" id="twitter" name="twitter" value={profile.socialMedia.twitter} onChange={handleSocialMediaChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="facebook" className="form-label">Facebook</label>
          <input type="text" className="form-control" id="facebook" name="facebook" value={profile.socialMedia.facebook} onChange={handleSocialMediaChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="linkedin" className="form-label">LinkedIn</label>
          <input type="text" className="form-control" id="linkedin" name="linkedin" value={profile.socialMedia.linkedin} onChange={handleSocialMediaChange} />
        </div>
        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>
      <h3>Change Password</h3>
      <form onSubmit={handlePasswordChange}>
        <div className="mb-3">
          <label htmlFor="currentPassword" className="form-label">Current Password</label>
          <input type="password" className="form-control" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">New Password</label>
          <input type="password" className="form-control" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Change Password</button>
      </form>
    </div>
  );
};

export default Profile;
