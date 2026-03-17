'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { updateProfile, User as FirebaseAuthUser } from 'firebase/auth';
import { Button, FileButton, Group, Progress, Stack, Text, Badge } from '@mantine/core';

import { storage } from '@/app/authentication/firebase';
import { useAuth } from '@/app/authentication/context';
import classes from './profile.module.css';

export function UserAvatarFile() {
  const [file, setFile] = useState<File | null>(null);
  const { currentUser, tenant } = useAuth();
  const [loading, setLoading] = useState(false);

  const defaultImgUrl = 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg';
  const [photoURL, setphotoURL] = useState<string | null | ArrayBuffer | undefined>(defaultImgUrl);
  const [perc, setPerc] = useState(0);
  useEffect(() => {
    setphotoURL(tenant?.photoURL);
  }, [tenant]);

  function handleFileChange(selectedFile: File | null) {
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setphotoURL(reader.result); // Update the preview image
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  function handleSetPhoto() {
    if (!file) return;

    setLoading(true);
    const storageRef = ref(storage, `avatars/${tenant?.id}.png`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Handle progress, state changes, etc.
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPerc(progress);
        switch (snapshot.state) {
          case 'paused':
            // console.log("Upload is paused");
            break;
          case 'running':
            // console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        setLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (currentUser) {
            updateProfile(currentUser as unknown as FirebaseAuthUser, { photoURL: downloadURL });
          }
          setLoading(false);
        });
      }
    );

    setFile(null);
  }

  return (
    <div className={classes.avatarPanel}>
      <Image
        src={photoURL ? String(photoURL) : defaultImgUrl} // Add a default image URL if photoURL is null
        alt="Avatar Image"
        width={400}
        height={400}
        className={classes.avatarImage}
      />
      <Stack className={classes.uploadActions}>
        <Group className={classes.uploadRow}>
          <FileButton onChange={handleFileChange} accept="image/png,image/jpeg,image/webp">
            {(props) => <Button {...props} variant="outline">Select Image</Button>}
          </FileButton>
          <Badge variant="light" color={file ? 'brand' : 'gray'}>
            {file ? 'File ready' : 'No file selected'}
          </Badge>
        </Group>
        <Text className={classes.uploadMeta}>
          Selected file: {file ? file.name : 'none'}
        </Text>
        <Button disabled={loading || !file} onClick={handleSetPhoto} loading={loading}>
          Update Avatar
        </Button>
      </Stack>
      {loading && <Progress value={perc} color="brand" animated />}
    </div>
  );
}
