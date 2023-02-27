<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-file-input
          id="file-upload"
          ref="ImageCropperInput"
          show-size
          counter
          chips
          :label="inputTitle"
          type="file"
          name="image"
          accept="image/*"
          :v-model="value"
          @change="setImage"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" style="position: relative">
        <img
          v-if="getOriginalImage()"
          :src="getOriginalImage()"
          class="original"
          :alt="inputTitle"
          max-width="200"
          @click="uploadImage"
        />
        <v-btn
          v-if="getOriginalImage()"
          style="right: -10px; top: -10px"
          small
          absolute
          dark
          fab
          top
          right
          color="grey"
          @click="deleteImage"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!-- div v-else class="crop-placeholder" @click="uploadImage" /-->
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template #activator="{ on: dialog }">
        <v-btn
          v-if="originalImage"
          color="primary float-right"
          dark
          top
          right
          fab
          v-on="dialog"
        >
          <v-icon>mdi-crop</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-toolbar dark color>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Crop image</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-toolbar-items>
            <v-btn class="success" left @click="updateCroppedImage">
              <v-icon>mdi-crop</v-icon>Use cropped Image
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-row>
            <v-col xs12 sm8 md6>
              <section class="cropper-area">
                <div class="img-cropper">
                  <vue-cropper
                    ref="cropper"
                    :aspect-ratio="aspectRatio"
                    :src="image"
                    preview=".preview"
                  />
                </div>

                <div class="actions">
                  <v-btn-toggle class="mr-1">
                    <v-btn
                      label="Zoom in"
                      title="Zoom in"
                      @click.prevent="zoom(0.2)"
                    >
                      <v-icon>mdi-magnify-plus</v-icon>
                    </v-btn>
                    <v-btn
                      label="Zoom out"
                      title="Zoom out"
                      @click.prevent="zoom(-0.2)"
                    >
                      <v-icon>mdi-magnify-minus</v-icon>
                    </v-btn>
                  </v-btn-toggle>

                  <v-btn-toggle class="mr-1">
                    <v-btn title="Move left" @click.prevent="move(-10, 0)">
                      <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn title="Move right" @click.prevent="move(10, 0)">
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                    <v-btn title="Move up" @click.prevent="move(0, -10)">
                      <v-icon>mdi-chevron-up</v-icon>
                    </v-btn>
                    <v-btn title="Move down" @click.prevent="move(0, 10)">
                      <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                  </v-btn-toggle>

                  <v-btn-toggle class="mr-1">
                    <v-btn title="Rotate +90deg" @click.prevent="rotate(90)">
                      <v-icon>mdi-undo</v-icon>
                    </v-btn>
                    <v-btn title="Rotate -90deg" @click.prevent="rotate(-90)">
                      <v-icon>mdi-redo</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                  <v-btn-toggle class="mr-1">
                    <v-btn
                      title="Center horizontal"
                      @click.prevent="horizontal()"
                    >
                      <v-icon>mdi-format-horizontal-align-center</v-icon>
                    </v-btn>
                    <v-btn title="center vertical" @click.prevent="vertical()">
                      <v-icon>mdi-format-vertical-align-center</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </div>
                <small
                  >If your image does not fit in the frame use the zoom
                  function</small
                >
                <!--div class="actions">
                  <v-btn-toggle class="mr-1">
                    <v-btn
                      @click.prevent="setAspectRatio(1.7777777777)"
                      title="Aspect ratio: 19:9"
                    >16:9</v-btn>
                    <v-btn @click.prevent="setAspectRatio(1.3333333333)" title="Aspect ratio: 4:3">4:3</v-btn>
                    <v-btn @click.prevent="setAspectRatio(1)" title="Aspect ratio: 1:1">1:1</v-btn>
                    <v-btn @click.prevent="setAspectRatio(0.666666)" title="Aspect ratio: 2:3">2:3</v-btn>
                    <v-btn @click.prevent="setAspectRatio(NaN)" title="free transform">Free</v-btn>
                  </v-btn-toggle>
                </div-->
                <div class="actions">
                  <v-btn-toggle class="mr-1">
                    <!--v-btn @click.prevent="reset">
                      <v-icon>mdi-cached</v-icon>Reset
                    </v-btn-->
                  </v-btn-toggle>
                  <!--v-btn-toggle class="mr-1">
                    <v-btn @click.prevent="showFileChooser">
                      <v-icon>mdi-file-image-outline</v-icon>Upload Image
                    </v-btn>
                  </v-btn-toggle-->
                </div>
              </section>
            </v-col>
            <v-col md12>
              <section class="preview-area">
                <p>Preview</p>
                <div class="preview" />
              </section>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import { RepositoryFactory } from "@/utils/repositories/repositoryFactory";
//const AttachmentRepository = RepositoryFactory.get("attachments");
// eslint-disable-next-line
import dataURLtoBlob from "blueimp-canvas-to-blob";

export default {
  name: "ImageCropper",
  components: {
    VueCropper,
  },
  props: {
    value: {
      type: String,
    },
    inputTitle: {
      type: String,
    },
    fieldName: {
      type: String,
    },
    container: {
      type: Object,
    },
    aspectRatio: {
      type: String,
    },
  },
  data() {
    return {
      image: null,
      imgSrc: "",
      cropImg: "",
      data: null,
      originalImage: "",
      dialog: false,
    };
  },
  methods: {
    getOriginalImage() {
      if (this.value) {
        return this.getApiImageUrl(this.container, this.fieldName);
      } else {
        return false;
      }
    },
    uploadImage() {
      document.getElementById("file-upload").click();
      //this.$refs["ImageCropperInput"].click();
    },
    deleteImage() {
      this.$emit("handleDelete", this.fieldName);
    },
    setImage(file) {
      if (file === null) {
        return;
      }
      if (file.type.indexOf("image/") === -1) {
        this.$toast.info("Please select an image file");
        return;
      }
      this.image_path = file;
      if (typeof FileReader === "function") {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          this.dialog = true;
          this.image = this.originalImage = event.target.result;
          setTimeout(
            // rebuild cropperjs with the updated source
            () => this.$refs.cropper.replace(event.target.result),
            300
          );
        };
      } else {
        this.$toast.error(
          "Ein technisches Problem ist aufgetreten (FileReader API not supported)"
        );
      }
    },
    updateCroppedImage() {
      var self = this;
      this.originalImage = this.$refs.cropper.getCroppedCanvas().toDataURL();

      if (this.$refs.cropper.getCroppedCanvas().toBlob) {
        this.$refs.cropper.getCroppedCanvas().toBlob(function (blob) {
          self.$emit("input", "file set");
          self.$emit("handleUpload", self.fieldName, blob, self.image_path);
          self.dialog = false;
        });
      } else {
        console.log("toBlob function not supported...");
      }
    },

    getCropBoxData() {
      this.data = JSON.stringify(this.$refs.cropper.getCropBoxData(), null, 4);
    },
    getData() {
      this.data = JSON.stringify(this.$refs.cropper.getData(), null, 4);
    },
    move(offsetX, offsetY) {
      this.$refs.cropper.move(offsetX, offsetY);
    },
    horizontal() {
      var container = this.$refs.cropper.getContainerData();
      var box = this.$refs.cropper.getCropBoxData();
      var offsetX = (container.width - box.width) / 2;
      this.$refs.cropper.setCropBoxData({
        left: offsetX,
        top: box.top,
        width: box.width,
        height: box.height,
      });
    },
    vertical() {
      var container = this.$refs.cropper.getContainerData();
      var box = this.$refs.cropper.getCropBoxData();
      var offsetY = (container.height - box.height) / 2;
      this.$refs.cropper.setCropBoxData({
        left: box.left,
        top: offsetY,
        width: box.width,
        height: box.height,
      });
    },
    setAspectRatio(value) {
      this.$refs.cropper.setAspectRatio(value);
    },
    reset() {
      this.$refs.cropper.reset();
    },
    rotate(deg) {
      this.$refs.cropper.rotate(deg);
    },
    setCropBoxData() {
      if (!this.data) return;
      this.$refs.cropper.setCropBoxData(JSON.parse(this.data));
    },
    setData() {
      if (!this.data) return;
      this.$refs.cropper.setData(JSON.parse(this.data));
    },

    showFileChooser() {
      this.$refs.input.click();
    },
    zoom(percent) {
      this.$refs.cropper.relativeZoom(percent);
    },
    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
    },
    getApiImageUrl(place, fieldName) {
      //return AttachmentRepository.getApiImageUrl(place.id, place[fieldName]);
    },
  },
};
</script>
<style scoped>
.cropper-area {
  width: 614px;
}
.actions {
  margin-top: 1rem;
}
.actions a {
  display: inline-block;
  padding: 5px 15px;
  background: #0062cc;
  color: white;
  text-decoration: none;
  border-radius: 3px;
  margin-right: 1rem;
  margin-bottom: 1rem;
}
textarea {
  width: 100%;
  height: 100px;
}

.preview-area p {
  font-size: 1.25rem;
  margin: 0;
  margin-bottom: 1rem;
}
.preview-area p:last-of-type {
  margin-top: 1rem;
}
.preview {
  width: 100%;
  height: calc(472px * (9 / 16));
  overflow: hidden;
  background-image: repeating-linear-gradient(
    45deg,
    white 0%,
    white 2%,
    grey 2%,
    grey 4%,
    white 4%
  );
}
.image-holder {
  background-image: repeating-linear-gradient(
    45deg,
    white 0%,
    white 2%,
    grey 2%,
    grey 4%,
    white 4%
  );
}
.original {
  width: 100%;
}
.crop-placeholder {
  width: 100%;
  height: 200px;
  background: #f2f2f2;
  border: 4px dotted #ddd;
  margin: 10px;
}
.cropped-image img {
  max-width: 100%;
}

.v-color-picker__color {
  width: 65px;
  height: 35px;
  max-height: 35px;
}
.v-dialog__content {
  z-index: 15802 !important;
}
</style>
