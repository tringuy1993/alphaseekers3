'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useForm } from '@mantine/form';
import { Button, Group, TextInput } from '@mantine/core';

import { db } from '@/app/authentication/firebase';
import { useAuth } from '@/app/authentication/context';
import SelectWrapper from '@/components/SelectWrapper';

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const;

const defaultValues = {
  userName: '',
  phoneNumber: '',
  language: 'en',
};

interface UserData {
  userName?: string;
  phoneNumber?: string;
  language?: string;
  timeStamp?: any;
}

const accountINFO = [
  {
    name: 'userName',
    label: 'User Name',
    placeHolder: 'User name',
    description: 'Display on your profile',
    inputType: null,
  },
  {
    name: 'phoneNumber',
    label: 'Phone Number',
    placeHolder: '+1(999)-999-9999',
    description: null,
    inputType: null,
  },
];

const fetchUserData = async (tenantId: string): Promise<UserData | null> => {
  try {
    const docRef = doc(db, 'users', tenantId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserData;
    }
  } catch (error) {
    console.error(error);
    return null;
  }

  return null;
};

export function UserProfileUpdate() {
  const form = useForm({
    initialValues: defaultValues,
  });
  const { tenant } = useAuth();
  const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false);

  const handleAccountFormSubmit = async (formData: UserData) => {
    // Additional logic for handling account form data
    setLoadingUpdateProfile(true);
    try {
      await setDoc(doc(db, 'users', tenant?.id as string), {
        ...formData,
        timeStamp: serverTimestamp(),
      });
      setLoadingUpdateProfile(false);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    //Setting Form Fields to fetched data
    const fetchData = async () => {
      if (tenant?.id) {
        try {
          const data = await fetchUserData(tenant.id);
          if (data) {
            const { timeStamp, ...dataWithoutTimeStamp } = data;
            form.setValues((prev) => ({ ...prev, ...dataWithoutTimeStamp }));
          }
        } catch (error) {
          throw error;
        }
      }
    };

    fetchData();
  }, [tenant]);

  const handleSubmit = form.onSubmit((data) => {
    handleAccountFormSubmit(data); // This includes both main form fields and language
  });

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label={accountINFO[0].label}
        placeholder={accountINFO[0].placeHolder}
        {...form.getInputProps(accountINFO[0].name)}
      />
      <TextInput
        label={accountINFO[1].label}
        placeholder={accountINFO[1].placeHolder}
        {...form.getInputProps(accountINFO[1].name)}
      />
      <SelectWrapper
        data={languages}
        label="Language"
        value={form.values.language}
        onChange={(value: string) => form.setFieldValue('language', value)}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit" disabled={loadingUpdateProfile}>
          Update Profile
        </Button>
      </Group>
    </form>
  );
}
