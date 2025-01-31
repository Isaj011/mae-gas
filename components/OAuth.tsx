import React from 'react';
import { View, Text, Image } from 'react-native';
import CustomButton from './CustomButton';
import { icons } from '../constants';

const OAuth = () =>  {
    const handleGoogleSignIn = async() => {}
    return (
        <View>
            <View className='flex flex-row justify-center items-center mt-4 gap-x-3'>
                <View className='flex-1 h-[1px] bg-general-100'/>
                <Text className='text-lg'>Or</Text>
                <View className='flex-1 h-[1px] bg-general-100'/>
            </View>
            <CustomButton
                title='Log In with Google'
                bgVariant='outline'
                textVariant='primary'
                className='mt-5 w-full shadow-none'
                IconLeft={ () => (
                <Image source={icons.google}
                    className='w-6 h-6 mx-2'
                    resizeMode='contain'/>
            )}
                onPress={handleGoogleSignIn}
                />
        </View>
  )};


export default OAuth;
