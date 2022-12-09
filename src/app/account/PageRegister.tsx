import React, { useEffect, useRef, useState } from 'react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  ScaleFade,
  Stack,
} from '@chakra-ui/react';
import { AuthEventError } from '@firebase/auth/dist/src/model/popup_redirect';
import { Formiz, useForm } from '@formiz/core';
import { isEmail, isMaxLength, isMinLength } from '@formiz/validations';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { Trans, useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { FieldInput } from '@/components/FieldInput';
import { FieldSelect } from '@/components/FieldSelect';
import { SlideIn } from '@/components/SlideIn';
import { useToastError, useToastSuccess } from '@/components/Toast';
import { AVAILABLE_LANGUAGES } from '@/constants/i18n';

export const PageRegister = () => {
  const { t, i18n } = useTranslation();
  const form = useForm({
    subscribe: { form: true, fields: ['langKey', 'email'] },
  });
  const fileRef = useRef();
  const toastError = useToastError();
  const toastSuccess = useToastSuccess();

  // Change language based on form
  useEffect(() => {
    i18n.changeLanguage(form.values?.langKey);
  }, [i18n, form.values?.langKey]);

  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const createAccount = async (formValues: {
    email: string;
    password: string;
    username: string;
  }) => {
    setIsLoading(true);
    try {
      // create user in authentication system
      const userCredential = await createUserWithEmailAndPassword(
        getAuth(),
        formValues.email,
        formValues.password
      );
      const user = userCredential.user;
      console.log({ user, uid: user.uid });

      // TODO create user in database
      // TODO handle image upload
      setIsSuccess(true);
    } catch (error) {
      const firebaseError = error as AuthEventError;
      const errorCode = firebaseError.code;
      const errorMessage = firebaseError.message;
      console.error({ errorCode, errorMessage });

      toastError({
        title: t('account:register.feedbacks.registrationError.title'),
        description: firebaseError.message,
      });
      if (errorCode === 'auth/email-already-in-use') {
        form.invalidateFields({ email: t('account:data.email.alreadyUsed') });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const handleImageUpload = async (userUid: string) => {
  //   // TODO
  // };
  //
  // const handleTransfer = (snapshot: UploadTaskSnapshot) => {
  //
  // };
  //
  // const handleUploadFailed = () => {
  //   toastError({ title: 'Error', description: "Couldn't upload file" });
  // };
  //
  // const handleUploadSucceed = async (task: UploadTask, userUid: string) => {
  //   // TODO handle download URL
  //
  //   toastSuccess({
  //     title: 'Success',
  //     description: 'File uploaded successfully',
  //   });
  //
  //   setIsSuccess(true);
  // };

  if (isSuccess) {
    return (
      <Center p="4" m="auto">
        <ScaleFade initialScale={0.9} in>
          <Alert
            status="success"
            variant="solid"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="lg"
            px="8"
            py="4"
          >
            <Box fontSize="3rem">🎉</Box>
            <AlertTitle mt={4} mb={1} fontSize="lg">
              {t('account:register.feedbacks.registrationSuccess.title')}
            </AlertTitle>
            <AlertDescription>
              <Trans
                t={t}
                i18nKey="account:register.feedbacks.registrationSuccess.description"
                values={{ email: form.values.email }}
              />
            </AlertDescription>
          </Alert>
          <Center mt="8">
            <Button
              as={RouterLink}
              to="/login"
              variant="link"
              color="brand.500"
              _dark={{ color: 'brand.300' }}
            >
              {t('account:register.actions.goToLogin')}
            </Button>
          </Center>
        </ScaleFade>
      </Center>
    );
  }

  return (
    <SlideIn>
      <Box p="2" pb="4rem" w="22rem" maxW="full" m="auto">
        <Formiz
          id="register-form"
          autoForm
          onValidSubmit={createAccount}
          connect={form}
        >
          <Box
            p="6"
            borderRadius="md"
            boxShadow="md"
            bg="white"
            _dark={{ bg: 'blackAlpha.400' }}
          >
            <Heading size="lg" mb="4">
              {t('account:register.title')}
            </Heading>
            <Stack spacing="4">
              <FieldSelect
                name="langKey"
                label={t('account:data.language.label')}
                options={AVAILABLE_LANGUAGES.map(({ key }) => ({
                  label: t(`languages.${key}`),
                  value: key,
                }))}
                defaultValue={i18n.language}
              />
              <FieldInput
                name="username"
                label={t('account:data.login.label')}
                required={t('account:data.login.required') as string}
                validations={[
                  {
                    rule: isMinLength(2),
                    message: t('account:data.login.tooShort', { min: 2 }),
                  },
                  {
                    rule: isMaxLength(50),
                    message: t('account:data.login.tooLong', { max: 50 }),
                  },
                ]}
              />
              <FieldInput
                name="email"
                label={t('account:data.email.label')}
                required={t('account:data.email.required') as string}
                validations={[
                  {
                    rule: isMinLength(5),
                    message: t('account:data.email.tooShort', { min: 5 }),
                  },
                  {
                    rule: isMaxLength(254),
                    message: t('account:data.email.tooLong', { min: 254 }),
                  },
                  {
                    rule: isEmail(),
                    message: t('account:data.email.invalid'),
                  },
                ]}
              />
              <FieldInput
                name="password"
                type="password"
                label={t('account:data.password.label')}
                required={t('account:data.password.required') as string}
                validations={[
                  {
                    rule: isMinLength(4),
                    message: t('account:data.password.tooShort', { min: 4 }),
                  },
                  {
                    rule: isMaxLength(50),
                    message: t('account:data.password.tooLong', { min: 50 }),
                  },
                ]}
              />
              <FieldInput
                name="avatar"
                type="file"
                label="Avatar"
                helper={
                  !!fileUploadProgress &&
                  `File upload started ${Math.round(fileUploadProgress)}%`
                }
                onChange={(evt) => {
                  if (!!evt?.target?.files?.[0]) {
                    fileRef.current = evt?.target?.files?.[0];
                  }
                }}
              />
              <Flex>
                <Button
                  isLoading={isLoading}
                  isDisabled={form.isSubmitted && !form.isValid}
                  type="submit"
                  variant="@primary"
                  ms="auto"
                >
                  {t('account:register.actions.create')}
                </Button>
              </Flex>
            </Stack>
          </Box>
          <Center mt="8">
            <Button as={RouterLink} to="/login" variant="link">
              {t('account:register.actions.alreadyHaveAnAccount')}{' '}
              <Box
                as="strong"
                ms="2"
                color="brand.500"
                _dark={{ color: 'brand.300' }}
              >
                {t('account:register.actions.login')}
              </Box>
            </Button>
          </Center>
        </Formiz>
      </Box>
    </SlideIn>
  );
};
