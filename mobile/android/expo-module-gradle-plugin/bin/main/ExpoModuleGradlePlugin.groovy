import org.gradle.api.Plugin
import org.gradle.api.Project
import java.io.File

class ExpoModuleGradlePlugin implements Plugin<Project> {
    void apply(Project project) {
        // Ensure Android library plugin is applied first
        if (!project.plugins.hasPlugin('com.android.library')) {
            project.plugins.apply('com.android.library')
        }
        
        // Configure Android early to ensure compileSdkVersion is set
        project.android {
            compileSdkVersion project.rootProject.ext.has('compileSdkVersion') ? 
                project.rootProject.ext.compileSdkVersion : 34
            defaultConfig {
                minSdkVersion project.rootProject.ext.has('minSdkVersion') ? 
                    project.rootProject.ext.minSdkVersion : 23
                targetSdkVersion project.rootProject.ext.has('targetSdkVersion') ? 
                    project.rootProject.ext.targetSdkVersion : 34
            }
        }
        
        // Find expo-modules-core plugin script
        def expoModulesCorePath = project.rootProject.projectDir.toPath()
            .resolve("node_modules")
            .resolve("expo-modules-core")
            .resolve("android")
            .resolve("ExpoModulesCorePlugin.gradle")
            .toFile()
        
        // Fallback: check in parent node_modules (if hoisted)
        if (!expoModulesCorePath.exists()) {
            def parentPath = project.rootProject.projectDir.parentFile
            expoModulesCorePath = new File(parentPath, "node_modules/expo-modules-core/android/ExpoModulesCorePlugin.gradle")
        }
        
        if (expoModulesCorePath.exists()) {
            project.apply from: expoModulesCorePath
            
            // Apply the Kotlin Expo Modules Core Plugin after Android is configured
            project.afterEvaluate {
                if (project.extensions.extraProperties.has('applyKotlinExpoModulesCorePlugin')) {
                    def applyPlugin = project.extensions.extraProperties.get('applyKotlinExpoModulesCorePlugin')
                    if (applyPlugin instanceof Closure) {
                        try {
                            applyPlugin.call()
                        } catch (Exception e) {
                            project.logger.debug("Kotlin Expo Modules Core Plugin: ${e.message}")
                        }
                    }
                }
            }
        }
    }
}

