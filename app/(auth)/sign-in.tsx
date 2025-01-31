import React, { useState } from 'react';
import {ScrollView, Text, View, Image } from 'react-native';
import { images, icons } from '@/constants';
import InputField from '@/components/InputField';

import CustomButton from '@/components/CustomButton';
import { Link, useRouter  } from "expo-router";
import OAuth from '@/components/OAuth';
import { useSignIn } from '@clerk/clerk-expo'


const SignIn = () => {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [form, setForm] = useState({
        email: '',
        password: '',
    })

    // Handle the submission of the sign-in form
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, form.email, form.password])


    return (
        <ScrollView className='flex flex-1 bg-white'>
            <View className='flex-1 bg-white'>
                <View className='relative w-full h-[16rem]'>
                    <Image source={images.signUpCar} className='z-0 w-full h-[16rem]'/>
                    <Text className='text-2xl text-black font-JakartaSemiBold absolute bottom-4 left-4'>Welcome</Text>
                </View>
                <View className='p-6'>
                   
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
                        title='Sign In'
                        onPress={onSignInPress}
                        className='mt-8'
                    />

                    <OAuth/>
                    
                    <Link href='/sign-up' className='text-lg text-center text-general-200 mt-8'>
                        <Text className='text-center text-[#858585] mt-4'>Don't have an Account? </Text>
                        <Text className='text-[#0286FF]'>Sign Up</Text>
                    </Link>
                </View>

                {/* Verification Modal */}
            </View>
        </ScrollView>
    );
}


export default SignIn;
