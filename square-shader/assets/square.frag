precision lowp float;

uniform vec2 resolution;
uniform vec4 innerSquare;
uniform vec4 outerSquare;
uniform vec3 squareColor;

vec3 rgb(in float r, in float g, in float b) {
  return vec3(r / 255.0, g / 255.0, b / 255.0);
}

float rangeContainsValue(in float rangeStart, in float rangeEnd, in float value) {
  float isGreaterThanStart = step(rangeStart, value);
  float isGreaterThanEnd = step(rangeEnd, value);

  return isGreaterThanStart - isGreaterThanEnd;
}

float rectangleContainsPoint(in vec4 rectangle, in vec2 point) {
  return rangeContainsValue(rectangle.x, rectangle.z, point.x) *
         rangeContainsValue(rectangle.y, rectangle.w, point.y);
}

void main() {
  vec2 pixelCoord = gl_FragCoord.xy;

  vec2 normalizedCoord = pixelCoord / resolution;
  vec3 gradationBackgroundColor = vec3(0.15 * normalizedCoord.x + 0.85, 0.15 * normalizedCoord.y + 0.85, 1.0);

  vec3 pixelColor = mix(
    mix(gradationBackgroundColor, squareColor, rectangleContainsPoint(outerSquare, pixelCoord)),
    gradationBackgroundColor,
    rectangleContainsPoint(innerSquare, pixelCoord)
  );

  gl_FragColor = vec4(pixelColor, 1.0);
}