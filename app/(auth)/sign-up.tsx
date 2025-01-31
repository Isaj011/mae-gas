import React, { useState } from 'react';
import {ScrollView, Text, TextInput, View, Image, Button, Alert } from 'react-native';
import { images, icons } from '@/constants';
import InputField from '@/components/InputField';
import { useSignUp } from '@clerk/clerk-expo'
import { Link, router } from "expo-router";

import CustomButton from '@/components/CustomButton';
import OAuth from '@/components/OAuth';
import ReactNativeModal from "react-native-modal";


const SignUp = () => {
    const [form, setForm] = useState({
        name:'',
        email: '',
        password: '',
    })

    const [verification, setVerification] = useState({
        state: 'default',
        error:'',
        code: '',
    })

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { isLoaded, signUp, setActive } = useSignUp()

     // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setVerification({
        ...verification,
        state: 'pending'
      })
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert('Error', err.errors[0].longMessage)
    }
  }

  // Handle submission of verification form
  const onPressVerify = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        
        // TODO: Create db user
        await setActive({ session: signUpAttempt.createdSessionId })
        setVerification({
            ...verification,
            state: 'success'
        })
        // router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        setVerification({
            ...verification,
            error: 'Verification Failed',
            state: 'failed'
        })
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: 'failed'
      })
      console.error(JSON.stringify(err, null, 2))
    }
  }

//   if (verification) {
//     return (
//       <>
//         <Text>Verify your email</Text>
//         <TextInput
//           value={verification.code}
//           placeholder="Enter your verification code"
//         //   onChangeText={(code)=> setCode(code)}
//           onChangeText={(code)=> setVerification({
//             ...verification,
//             code:code
//           })}
//         />
//         <Button title="Verify" onPress={onPressVerify} />
//       </>
//     )
//   }

    return (
        <ScrollView className='flex flex-1 bg-white'>
            <View className='flex-1 bg-white'>
                <View className='relative w-full h-[16rem]'>
                    <Image source={images.signUpCar} className='z-0 w-full h-[16rem]'/>
                    <Text className='text-2xl text-black font-JakartaSemiBold absolute bottom-4 left-4'>Create Your Account</Text>
                </View>
                <View className='p-6'>
                    <InputField
                        label='Name'
                        placeholder='Enter your name'
                        // labelStyle='text-[#858585]'
                        // containerStyle='mb-4'
                        icon={icons.person}
                        value={form.name}
                        onChangeText={(value) => setForm({...form, name: value})}
                    />
                    <InputField
                        label='Email'
                        placeholder='Enter your email'
                        // labelStyle='text-[#858585]'
                        // containerStyle='mb-4'
                        icon={icons.email}
                        value={form.email}
                        onChangeText={(value) => setForm({...form, email: value})}
                    />
                    <InputField
                        label='Password'
                        placeholder='Enter your password'
                        // labelStyle='text-[#858585]'
                        // containerStyle='mb-4'
                        icon={icons.lock}
                        value={form.password}
                        secureTextEntry={true}
                        onChangeText={(value) => setForm({...form, password: value})}
                    />
                    <CustomButton
                        title='Sign Up'
                        onPress={onSignUpPress}
                        className='mt-8'
                    />

                    <OAuth/>
                    
                    <Link href='/sign-in' className='text-lg text-center text-general-200 mt-8'>
                        <Text className='text-center text-[#858585] mt-4'>Already have an account? </Text>
                        <Text className='text-[#0286FF]'>Log In</Text>
                    </Link>
                </View>

                <ReactNativeModal 
                  isVisible={verification.state === 'pending'} 
                  onModalHide={() => {
                      if (verification.state === 'success') setShowSuccessModal(true)
                    }
                  }>
                  <View className='bg-white px-6 py-8 rounded-2xl min-h-[20rem]'>
                    <Text className='text-center text-2xl text-black font-JakartaExtraBold'>Verification</Text>
                    <Text className='text-center mt-2 mb-4 font-Jakarta'>Verification Email sent to {form.email}</Text>
                    <InputField label='Code' placeholder='12345' icon={icons.lock} value={verification.code} onChangeText={(value) => setVerification({...verification, code: value}) } keyboardType='numeric'/>
                    {verification.error && 
                      <Text className='text-red-500 text-base text-center'>
                        {verification.error}
                      </Text>}
                    <CustomButton
                        title='Verify Email'
                        onPress={onPressVerify}
                        className='mt-6 bg-success-500' />
                  </View>
                </ReactNativeModal>
                <ReactNativeModal isVisible={showSuccessModal}>
                  <View className='bg-white px-6 py-8 rounded-2xl min-h-[20rem]'>
                    <Image source={images.check} className='w-16 h-16 mx-auto my-4'/>
                    <Text className='text-center text-2xl text-black font-JakartaSemiBold'>Verified</Text>
                    <Text className='text-center text-gray-600 mt-4 font-Jakarta'>Your account has been successfully created</Text>
                    <CustomButton
                        title='Browse Home'
                        onPress={() => {
                          setShowSuccessModal(false)
                          router.push('/(root)/(tabs)/home')}
                        }
                        className='mt-6' />
                  </View>
                </ReactNativeModal>
            </View>
        </ScrollView>
    );
}


export default SignUp;
