require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-gemius-plugin"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-gemius-plugin
                   DESC
  s.homepage     = "https://github.com/github_account/react-native-gemius-plugin"
  s.license      = "MIT"
  # s.license    = { :type => "MIT", :file => "FILE_LICENSE" }
  s.authors      = { "Your Name" => "yourname@email.com" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/github_account/react-native-gemius-plugin.git", :tag => "#{s.version}" }

  # Try uncommenting if something wrong
  # s.static_framework = true
  
  s.source_files = "ios/*.{h,m}"
  s.vendored_frameworks = 'ios/Frameworks/GemiusSDK.xcframework'
  s.frameworks = 'GemiusSDK'

  s.dependency "React"
	
  # s.dependency "..."
end

