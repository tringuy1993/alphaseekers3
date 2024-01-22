'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { Button, FileButton, Group, Progress, Stack, Text } from '@mantine/core';

import { storage } from '@/app/authentication/firebase';
import { useAuth } from '@/app/authentication/context';

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
          updateProfile(currentUser, { photoURL: downloadURL });
          setLoading(false);
        });
      }
    );

    setFile(null);
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Image
        src={photoURL ? String(photoURL) : defaultImgUrl} // Add a default image URL if photoURL is null
        alt="Avatar Image"
        width={400}
        height={400}
        style={{ borderRadius: '10%', border: '1px solid #fff' }}
      />
      <Stack>
        <Group>
          <FileButton onChange={handleFileChange} accept="image/png,image/jpeg">
            {(props) => <Button {...props}>Select Image</Button>}
          </FileButton>
          <Text>Selected File: {file ? file.name : 'No file Selected'}</Text>
        </Group>
        <Button disabled={loading || !file} onClick={handleSetPhoto}>
          Update Avatar
        </Button>
      </Stack>
      {loading && <Progress value={perc} />}
    </div>
  );
}
