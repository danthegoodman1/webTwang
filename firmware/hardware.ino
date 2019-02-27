#include <Adafruit_CircuitPlayground.h>

// Parts of this file taken from Carter Nelson @ Adafruit
 
#define SHAKE_THRESHOLD  20 // Total acceleration threshold for roll detect
 
float X, Y, Z, totalAccel;

float greenPosition = 0;
float yellowPosition = 0;
long shakeTime = 0;
 
///////////////////////////////////////////////////////////////////////////////
void setup() {
  Serial.begin(9600);
 
  CircuitPlayground.begin();
  CircuitPlayground.setAccelRange(LIS3DH_RANGE_8_G);
  
  tone(5, 440, 1000);
}
 
///////////////////////////////////////////////////////////////////////////////
void loop() {
  
  float angle = CircuitPlayground.motionX();
  Serial.print("a:");
  Serial.println(angle);
  
  // Compute total acceleration
  X = 0;
  Y = 0;
  Z = 0;
  for (int i=0; i<10; i++) {
    X += CircuitPlayground.motionX();
    Y += CircuitPlayground.motionY();
    Z += CircuitPlayground.motionZ();
    delay(1);
  }
  X /= 10;
  Y /= 10;
  Z /= 10;
 
  totalAccel = sqrt(X*X + Y*Y + Z*Z);
 
  if (CircuitPlayground.slideSwitch()) {
    int freq = 100+((float)abs(angle)*100.0);
    // CircuitPlayground.playTone(freq, 40, false);
    
    noTone(5);
  }
 
  if (totalAccel > SHAKE_THRESHOLD) {
    Serial.print("s:");
    Serial.println(totalAccel - SHAKE_THRESHOLD);
    shakeTime = millis();
  }
  
  float shakeAnimProgress = (millis()-shakeTime)/1000.0;
  yellowPosition -= .03 + ((.15)*(1.0/shakeAnimProgress))/4;
  if (yellowPosition > 1.0) yellowPosition = 0.0;
  if (yellowPosition < 0.0) yellowPosition = 0.9999;
  
  greenPosition += (angle/100)*4;
  if (greenPosition > 1.0) greenPosition = 0.0;
  if (greenPosition < 0.0) greenPosition = 0.9999;
  
  if (millis() > shakeTime + 1000) {
    CircuitPlayground.clearPixels();
    CircuitPlayground.setPixelColor((int) (5*greenPosition), 0, 255, 0);
    CircuitPlayground.setPixelColor(9 - (int) (5*greenPosition), 0, 255, 0);
  } else {
    CircuitPlayground.clearPixels();
    CircuitPlayground.setPixelColor((int) (3*yellowPosition), 255, 255, 0);
    CircuitPlayground.setPixelColor(4 - (int) (3*yellowPosition), 255, 255, 0);
    CircuitPlayground.setPixelColor(5 + (int) (3*yellowPosition), 255, 255, 0);
    CircuitPlayground.setPixelColor(9 - (int) (3*yellowPosition), 255, 255, 0);
  }
  
}
